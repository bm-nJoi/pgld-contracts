// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestMatchBetting {
    address treasuryAddress;
    uint256 public treasuryRoyaltyRate = 5;
    IERC20 public wagerToken;

    enum BetState {
        UNFINISHED, // keep as 0
        WIN, // keep as 1
        LOSS, // keep as 2
        CANCELLED,
        EXPIRED
    }
    
    struct Bet {
        uint256 id;
        address user;
        uint256 matchId; // id for contract map
        uint256 result; // 0->X, admin-run result enumeration
        uint256 amount;
        BetState state;
    }

    struct Match {
        uint256 id;
        uint256 resultRange; // maximum result option, so 2 would mean 1 and 2 are hte only answers allowed
        uint256 result; // 0 = undefined, 1->uint256 are result options
        bool complete;
        uint256 expirationTime;
    }

    uint256 public matchCounter;
    mapping(uint256 => Match) public matches;
    mapping(uint256 => uint256) public totalPoolAmounts; // maps matchId to its pools
    uint256 public totalDevPool = 0;
    // experimental
    mapping(address => uint256) public userPoolAmounts; // maps user address to their withdrawable pool amt

    uint256 public betCounter;
    mapping(uint256 => Bet) public bets;

    // make a mapping for tracking what bets belong to what matches
    mapping(uint256 => uint256[]) public matchBets;
    // mapping(address => uint256[]) public userBets; // this might be useful for sugar, come back to it

    event MatchStarted(uint256 indexed matchId, uint256 resultRange, uint256 expirationTime);
    event MatchEnded(uint256 indexed matchId, uint256 resultRange, bool expired); 
    
    event BetPlaced(uint256 indexed betId, uint256 indexed matchId, address indexed user, uint256 predictedResult, uint256 amount);
    event BetCancelled(uint256 indexed betId);
    event BetPayout(uint256 indexed betId, uint256 indexed matchId, address indexed user, uint256 amount);

    constructor(address _treasuryAddress, address _wagerToken) {
        treasuryAddress = _treasuryAddress;
        wagerToken = IERC20(_wagerToken);
    }

    // match starting function that establishes a competition to bet on
    function startMatch(uint256 _resultRange, uint256 _expirationTime) external {
        require(_resultRange > 0, "results must range from 1 to n");
        require(_expirationTime > block.timestamp, "expiration time must be in the future");
        matchCounter++;
        uint256 matchId = matchCounter;

        Match memory newMatch = Match({
            id: matchId,
            resultRange: _resultRange,
            result: 0,
            complete: false,
            expirationTime: _expirationTime
        });
        // store match data in mapping
        matches[matchId] = newMatch;

        // emit event for broadcasting id and details
        emit MatchStarted(matchId, _resultRange, _expirationTime);
    }

    // betting function for a true/false result
    //// will be set by a battleevent being processed via client
    function placeBet(uint256 _matchId, uint256 _amount, uint256 _predictedResult) external {
        require(_matchId < matchCounter, "matchId must be valid, below the matchCounter");
        require(_amount > 0, "Bet amount must be greater than 0");
        require(_predictedResult <= matches[_matchId].resultRange, "Predicted result must be within allowable range.");
        require(matches[_matchId].complete == false, "Match must be incomplete to place a bet.");
        betCounter++;
        uint256 betId = betCounter;

        Bet memory newBet = Bet({
            id: betId,
            user: msg.sender,
            matchId: _matchId,
            result: _predictedResult,
            amount: _amount,
            state: BetState.UNFINISHED
        });
        // add bet details to bet mapping
        bets[betId] = newBet;
        // also push the betId to the matchBets mapping
        matchBets[_matchId].push(betId);

        emit BetPlaced(betId,_matchId, msg.sender, _predictedResult, _amount);
    }

    function getMatchCounter() external view returns (uint256) {
        return matchCounter;
    }

    function getBetCounter() external view returns (uint256) {
        return betCounter;
    }

    // TODO :: this should be admin-only, dont launch with public cancellable bets
    function cancelBet(uint256 _betId) external {
        require(bets[_betId].user != address(0), "Bet does not exist");
        emit BetCancelled(_betId);
    }

    function processResults(uint256 _matchId, uint256 _actualResult) external {
        require(matches[_matchId].complete == false, "Match must be incomplete to place a bet.");
        matches[_matchId].complete = true;
        matches[_matchId].result = _actualResult;
        
        if (block.timestamp >= matches[_matchId].expirationTime) {
            emit MatchEnded(_matchId, _actualResult, true);
        } else {
            emit MatchEnded(_matchId, _actualResult, false);
        }
    }

    ////////
    // basic owner functions 
    ///////

    // Function to withdraw any excess funds sent to the contract
    // TODO:: change to withdraw to owner obvi
    function withdrawDevTreasury(address withdrawTo) external {
        require(totalDevPool > 0, "No treasury funds");
        wagerToken.transfer(withdrawTo, totalDevPool);
    }

    // Function to set the developer royalty rate (in percentage)
    function setTreasuryRoyaltyRate(uint256 _royaltyRate) external {
        require(_royaltyRate <= 100, "Royalty rate cannot exceed 100%");
        treasuryRoyaltyRate = _royaltyRate;
    }

    //////
    // views
    //////

    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }

    function getBetsForMatch(uint256 betId) external view returns (uint256[] memory) {
        return matchBets[betId];
    }

    function getMatch(uint256 matchId) external view returns (Match memory) {
        return matches[matchId];
    }

    function getMatches() external view returns (Match[] memory) {
        Match[] memory allMatches = new Match[](matchCounter);
        for(uint256 i = 0; i < matchCounter; i++){
            allMatches[i] = matches[i];
        }
        return allMatches;
    }

    // TODO :: bets sugar 
    // function getBets() external view returns (Match[] memory) {
    //     Match[] memory allBets = new Match[](betCounter);
    //     for(uint256 i = 0; i < betCounter; i++){
    //         allBets[i] = bets[i];
    //     }
    //     return allBets;
    // }

    // Function to get the total pool amount for a given matchId and result type
    // TODO:: optimize, this scales linearly with bets, probably can encapsulate bets into the match object
    function getTotalPoolAmountForResult(uint256 matchId, uint256 result) external view returns (uint256) {
        uint256 totalResultPool;
        for (uint256 i; i < matchBets[matchId].length; i++) {
            uint256 betId = matchBets[matchId][i];
            if (bets[betId].matchId == matchId && bets[betId].result == result) {
                totalResultPool += bets[i].amount;
            }
        }
        
        return totalResultPool;
    }

    // sugar function to get the total pool amount for a given matchId
    function getTotalPoolAmount(uint256 matchId) external view returns (uint256) {
        return totalPoolAmounts[matchId];
    }

    // sugar function to get the total pool amount for a given useraddress
    function getUserPoolAmount(address userAddress) external view returns (uint256) {
        return userPoolAmounts[userAddress];
    }

    // TODO:: assess this as sugar
    // function getUserBetHistory(address userAddress) external view returns (Bet[] memory) {
    //     Bet[] memory userBets = new Bet[](userToBets[userAddress].length);
    //     for (uint256 i = 0; i < userToBets[userAddress].length; i++) {
    //         userBets[i] = bets[userToBets[userAddress][i]];
    //     }
    //     return userBets;
    // }

    function getDevPoolAmount() external view returns (uint256) {
        return totalDevPool;
    }
}