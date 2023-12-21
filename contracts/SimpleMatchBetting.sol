// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {BattleAndGauntletContract} from "./BattleAndGauntletContract.sol";

contract SimpleMatchBetting {
    address battleAddress;
    //address gauntletAddress;
    address treasuryAddress;
    uint256 public treasuryRoyaltyRate = 5;
    IERC20 public wagerToken;

    enum BetState {
        UNFINISHED, // keep as 0
        WINNER, // keep as 1
        CANCELLED,
        EXPIRED
    }
    struct Bet {
        address user;
        uint32 matchId; // id for contract map
        uint8 result; // 0->X, admin-run result enumeration
        uint256 amount;
        BetState state;
    }

    struct Match {
        uint8 resultRange; // maximum result option, so 2 would mean 1 and 2 are hte only answers allowed
        uint8 result; // 0 = undefined, 1->uint8 are result options
        bool complete;
        uint256 expirationTime;
    }

    uint32 public matchCounter = 0;
    mapping(uint32 => Match) public matches;
    mapping(uint32 => uint256) public totalPoolAmounts; // maps matchId to its pools
    uint256 public totalDevPool = 0;
    // experimental
    mapping(address => uint256) public userPoolAmounts; // maps user address to their withdrawable pool amt

    uint32 public betCounter = 0;
    mapping(uint32 => Bet) public bets;

    // make a mapping for tracking what bets belong to what matches
    mapping(uint32 => uint32[]) public matchToBets;
    mapping(address => uint32[]) public userToBets;

    event MatchStarted(uint32 indexed matchId, uint8 resultRange, uint256 expirationTime);
    event MatchEnded(uint32 indexed matchId, uint8 resultRange, bool expired); 
    
    event BetPlaced(uint32 indexed betId, uint32 indexed matchId, address indexed user, uint8 predictedResult, uint256 amount);
    event BetCancelled(uint32 indexed betId);
    event BetPayout(uint32 indexed betId, uint32 indexed matchId, address indexed user, uint256 amount);

    constructor(address _battleAddress, address _treasuryAddress, address _wagerToken) {
        battleAddress = _battleAddress;
        treasuryAddress = _treasuryAddress;
        wagerToken = IERC20(_wagerToken);
    }

    // match starting function that establishes a competition to bet on
    function startMatch(uint8 resultRange, uint256 expirationTime) external {
        uint32 matchId = matchCounter;
        matchCounter = matchCounter + 1;

        Match memory newMatch = Match({
            resultRange: resultRange,
            result: 0,
            complete: false,
            expirationTime: expirationTime
        });
        matches[matchId] = newMatch;

        emit MatchStarted(matchId, resultRange, expirationTime);
    }

    // function checkBattleState(uint32 battleId) external view returns (bool) {
    //     BattleAndGauntletContract battles = BattleAndGauntletContract(battleAddress);
    //     BattleAndGauntletContract.BattleState memory battleState = battles.getBattleState(battleId);
    //     return battleState.success;
    // }

    // betting function for a true/false result
    //// will be set by a battleevent being processed via client
    function placeBet(uint32 matchId, uint256 amount, uint8 predictedResult) external { 
        require(amount > 0, "Bet amount must be greater than 0");
        require(predictedResult < matches[matchId].resultRange, "Predicted result must be within allowable range.");

        // Transfer the accepted token from the user to the contract
        require(wagerToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        totalPoolAmounts[matchId] += amount;

        uint32 betId = betCounter;
        betCounter = betId + 1;
        require(betId + 1 > betId, "Bet counter overflow"); // Check for overflow

        Bet memory newBet = Bet({
            user: msg.sender,
            matchId: matchId,
            result: predictedResult,
            amount: amount,
            state: BetState.UNFINISHED
        });
        bets[betId] = newBet;

        matchToBets[matchId].push(betId);

        emit BetPlaced(betId, matchId, msg.sender, predictedResult, amount);
    }

    function cancelBet(uint32 betId) external {
        require(bets[betId].user == msg.sender, "This bet can only be cancelled by the originator.");
        uint32 matchId = bets[betId].matchId;
        require(!matches[matchId].complete, "That match has already ended, this bet cannot be withdrawn.");
        uint256 betAmount = bets[betId].amount;

        totalPoolAmounts[matchId] -= betAmount;
        userPoolAmounts[msg.sender] -= betAmount;

        wagerToken.transfer(address(msg.sender), betAmount);
        emit BetCancelled(betId);
        bets[betId].state = BetState.CANCELLED;
    }

    ////
    // bet results updating
    ////
    //// takes a manual result and applies it to a given bet, then closes that bet
    ////// TODO:: not an onlyOwner function, figure out proper results ingress
    function processResults(uint32 matchId, uint8 actualResult) external {
        require(matches[matchId].result != actualResult, "matchId either doesnt exist or already has that result");
        require(matches[matchId].complete == false, "This match has already distributed to winners.");
        matches[matchId].complete = true;
        matches[matchId].result = actualResult;
        // TODO:: do some thing to check result events contract here?
        // contractResult = fetchContractResult(resultEventsContract)

        // check the time of this result, is it expired? if not, distribute
        if (block.timestamp < matches[matchId].expirationTime) {
            uint32 winnerCount = 0;
            for (uint256 i = 0; i < matchToBets[matchId].length; i++) {
                uint32 betId = matchToBets[matchId][i];
                if (bets[betId].result == actualResult && bets[betId].state == BetState.UNFINISHED) {
                    bets[betId].state = BetState.WINNER;
                    winnerCount++;
                }
            } 
            distributeToWinners(matchId, winnerCount);
        } else {
            distributeExpiredMatch(matchId);
        }
    }

    function distributeToWinners(uint32 matchId, uint32 winnerCount) internal {
        require(totalPoolAmounts[matchId] > 0, "No funds in the pool for the specified matchId");
        
        uint256 developerRoyalty = (totalPoolAmounts[matchId] * treasuryRoyaltyRate) / 100;
        uint256 netPoolAmount = totalPoolAmounts[matchId] - developerRoyalty;

        // Transfer royalty to the contract
        wagerToken.transfer(address(this), developerRoyalty);
        totalDevPool += developerRoyalty;
    
        for (uint256 i = 0; i < matchToBets[matchId].length; i++) {
            uint32 betId = matchToBets[matchId][i];
            if (bets[betId].state == BetState.WINNER) {
                uint256 userShare = netPoolAmount / winnerCount;
                userPoolAmounts[bets[betId].user] = userShare;
                emit BetPayout(betId, matchId, bets[betId].user, userShare);
            }
        }
        // TODO:: fix - send truncated shares to dev pool on odd calcs
        totalPoolAmounts[matchId] = 0;
        emit MatchEnded(matchId, matches[matchId].result, false);
    }
    
    function distributeExpiredMatch(uint32 matchId) internal {
        require(totalPoolAmounts[matchId] > 0, "No funds in the pool for the specified matchId");

        // dont take royalties in an expired match thats rude nobody won anything
        // ok taht also means we are paying a bunch of gas for this hehe but whatever this is a test contract
        // TODO:: require matches to self-withdraw

        for (uint256 i = 0; i < matchToBets[matchId].length; i++) {
            uint32 betId = matchToBets[matchId][i];
            uint256 betAmount = bets[betId].amount;
            address betUser = bets[betId].user;

            if (bets[betId].state == BetState.CANCELLED) {
                totalPoolAmounts[matchId] -= betAmount;
                userPoolAmounts[betUser] -= betAmount;
                wagerToken.transfer(betUser, betAmount);
                bets[betId].state = BetState.EXPIRED;
                emit BetCancelled(betId);
            }
        }
        emit MatchEnded(matchId, matches[matchId].result, true);
    }

    function withdrawUserPool() external { 
        // TODO:: this needs to also recall bets, i have to figure that out
        // i think bet pool has  to split from winning pool
        //
        require(userPoolAmounts[msg.sender] > 0, "This address has no withdrawable assets.");
        wagerToken.transfer(msg.sender, userPoolAmounts[msg.sender]);
        userPoolAmounts[msg.sender] -= userPoolAmounts[msg.sender];
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

    function getBet(uint32 betId) external view returns (Bet memory) {
        return bets[betId];
    }

    function getBetsForMatch(uint32 betId) external view returns (uint32[] memory) {
        return matchToBets[betId];
    }

    function getMatch(uint32 matchId) external view returns (Match memory) {
        return matches[matchId];
    }

    function getMatches() external view returns (Match[] memory) {
        Match[] memory allMatches = new Match[](matchCounter);
        for(uint32 i = 0; i < matchCounter; i++){
            allMatches[i] = matches[i];
        }
        return allMatches;
    }

    // Function to get the total pool amount for a given matchId and result type
    // TODO:: optimize, this scales linearly with bets, probably can encapsulate bets into the match object
    function getTotalPoolAmountForResult(uint32 matchId, uint8 result) external view returns (uint256) {
        uint256 totalResultPool;
        for (uint32 i; i < matchToBets[matchId].length; i++) {
            uint32 betId = matchToBets[matchId][i];
            if (bets[betId].matchId == matchId && bets[betId].result == result) {
                totalResultPool += bets[i].amount;
            }
        }
        
        return totalResultPool;
    }

    // sugar function to get the total pool amount for a given matchId
    function getTotalPoolAmount(uint32 matchId) external view returns (uint256) {
        return totalPoolAmounts[matchId];
    }

    // sugar function to get the total pool amount for a given useraddress
    function getUserPoolAmount(address userAddress) external view returns (uint256) {
        return userPoolAmounts[userAddress];
    }

    function getUserBetHistory(address userAddress) external view returns (Bet[] memory) {
        Bet[] memory userBets = new Bet[](userToBets[userAddress].length);
        for (uint32 i = 0; i < userToBets[userAddress].length; i++) {
            userBets[i] = bets[userToBets[userAddress][i]];
        }
        return userBets;
    }

    function getDevPoolAmount() external view returns (uint256) {
        return totalDevPool;
    }
}