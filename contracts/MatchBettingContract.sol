// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*import "@openzeppelin/contracts/access/Ownable.sol";
*/
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import {VersusResultType} from "./pirates_abis/BattleEvents_ABI.ts";
enum VersusResultType {
    UNDEFINED,
    ATTACKER_WIN,
    DEFENDER_WIN,
    DRAW
}

contract MatchBettingContract /*is Ownable*/ {
    address public resultEventsContract; // will be used later for fetching data maybe, or just store it here
    uint256 public developerRoyaltyRate = 5; // 5% royalty to the developer

    IERC20 public wagerToken;

    struct Bet {
        address user;
        uint256 matchId; // id for contract map
        VersusResultType predictedResult;
        uint256 amount;
        bool claimed; // this might be worthless im not sure yet
    }

    struct Match { 
        uint256 matchIdentifier; // mocked placeholder for ref to battleevent id
        VersusResultType result;
        bool closed;
        uint256 expirationTime;
    }

    uint32 public matchCounter;
    mapping(uint32 => Match) public matches;
    mapping(uint32 => uint256) public totalPoolAmounts; // maps matchId to its pools

    uint32 public betCounter;
    mapping(uint32 => Bet) public bets;

    // make a mapping for tracking what bets belong to what matches
    mapping(uint32 => uint32[]) public matchToBets;

    event MatchStarted(uint32 indexed matchId, uint256 matchIdentifier, uint256 expirationTime);
    // expired flag for if the match was completed with results or forced closed by expiration
    event MatchEnded(uint32 indexed matchId, VersusResultType result, bool expired); 
    
    event BetPlaced(uint32 indexed betId, uint32 indexed matchId, address indexed user, VersusResultType predictedResult, uint256 amount);
    // included betId to back-ref their original bet if desired
    event BetPayout(uint32 indexed betId, uint32 indexed matchId, address indexed user, uint256 amount);

    constructor(/*address initialOwner, */address _resultEventsContract, address _wagerToken) {
        //owner = initialOwner;
        resultEventsContract = _resultEventsContract;
        wagerToken = IERC20(_wagerToken);
    }

    // match starting function that establishes a competition to bet on
    function startMatch(uint256 matchIdentifier, uint256 expirationTime) external {
        // TODO :: should probably sanitize matchIdentifier
        /// like for (all matches) => check that we havent already started/finished betting on this match
        ////// 
        uint32 matchId = matchCounter;
        matchCounter = matchCounter + 1;

        matches[matchId] = Match({
            matchIdentifier: matchIdentifier,
            result: VersusResultType.UNDEFINED,
            closed: false,
            expirationTime: expirationTime
        });

        emit MatchStarted(matchId, matchIdentifier, expirationTime);
    }

    // betting function for a true/false result
    //// will be set by a battleevent being processed via client
    function placeBet(uint32 matchId, uint256 amount, VersusResultType predictedResult) external { 
        require(amount > 0, "Bet amount must be greater than 0");

        // Transfer the accepted token from the user to the contract
        wagerToken.transferFrom(msg.sender, address(this), amount);
        totalPoolAmounts[matchId] += amount;

        uint32 betId = betCounter;
        betCounter = betCounter + 1;
        bets[betId]  = Bet({
            user: msg.sender,
            matchId: matchId,
            predictedResult: predictedResult,
            amount: amount,
            claimed: false
        });
        // add this bet to the match mapping
        matchToBets[matchId].push(betId);

        emit BetPlaced(matchId, betId, msg.sender, predictedResult, amount);
    }

    ////
    // bet results updating
    ////
    //// takes a manual result and applies it to a given bet, then closes that bet
    ////// TODO:: not an onlyOwner function, figure out proper results ingress
    function processResults(uint32 matchId, VersusResultType actualResult) external {
        require(matches[matchId].result != actualResult, "matchId either doesnt exist or already has that result");
        require(resultEventsContract != address(0), "Result events contract not set");

        // TODO:: do some thing to check result events contract here?
        // contractResult = fetchContractResult(resultEventsContract)

        // check the time of this result, is it expired? if not, distribute
        if (block.timestamp < matches[matchId].expirationTime) {
            // for now, we set the result ourselves, then distribute winnings
            distributeToWinners(matchId, actualResult);
        } else {
            distributeExpiredMatch(matchId);
        }
    }

    /* TODO :: rewrite this to create distribution pools to withdraw from, to save gas */
    function distributeToWinners(uint32 matchId, VersusResultType result) internal {
        require(totalPoolAmounts[matchId] > 0, "No funds in the pool for the specified matchId");
        require(matches[matchId].closed == false, "This match has already distributed to winners.");
        matches[matchId].closed = true;
        matches[matchId].result = result;

        uint256 developerRoyalty = (totalPoolAmounts[matchId] * developerRoyaltyRate) / 100;
        uint256 netPoolAmount = totalPoolAmounts[matchId] - developerRoyalty;

        // Transfer royalty to the contract
        wagerToken.transfer(address(this), developerRoyalty);

        for (uint256 i = 0; i < matchToBets[matchId].length; i++) {
            uint32 betId = matchToBets[matchId][i];
            if (bets[betId].predictedResult == result && bets[betId].claimed == false) {
                uint256 userShare = (bets[betId].amount * netPoolAmount) / totalPoolAmounts[matchId];
                totalPoolAmounts[matchId] -= userShare;
                wagerToken.transfer(bets[betId].user, userShare);
                bets[betId].claimed = true;
                emit BetPayout(betId, matchId, bets[betId].user, userShare);
            }
        }
        emit MatchEnded(matchId, result, false);
    }
    
    function distributeExpiredMatch(uint32 matchId) internal {
        require(totalPoolAmounts[matchId] > 0, "No funds in the pool for the specified matchId");
        matches[matchId].closed = true;
        // matches[matchId].expired = false; // can be inferred, was removed

        // matches[matchId].result = VersusTypeResult.UNDEFINED; // - this is the default, can keep it this way

        // dont take royalties in an expired match thats rude nobody won anything
        // ok taht also means we are paying a bunch of gas for this hehe but whatever this is a test contract
        // TODO:: require matches to self-withdraw

        for (uint256 i = 0; i < matchToBets[matchId].length; i++) {
            uint32 betId = matchToBets[matchId][i];
            if (bets[betId].claimed == false) {
                totalPoolAmounts[matchId] -= bets[betId].amount;
                wagerToken.transfer(bets[betId].user, bets[betId].amount);
                bets[betId].claimed = true;
                emit BetPayout(betId, matchId, bets[betId].user, bets[betId].amount);
            }
        }
        emit MatchEnded(matchId, matches[matchId].result, true);
    }

    ////////
    // basic owner functions 
    ///////

    // Function to update the address of the contract determining the winner
    function updateResultEventsContract(address _resultEventsContract) external {
        resultEventsContract = _resultEventsContract;
    }

    // Function to withdraw any excess funds sent to the contract
    // TODO:: change to withdraw to owner obvi
    function withdrawExcess(uint32 matchId, address withdrawTo) external {
        require(wagerToken.balanceOf(address(this)) > totalPoolAmounts[matchId], "No excess funds");
        wagerToken.transfer(withdrawTo, wagerToken.balanceOf(address(this)) - totalPoolAmounts[matchId]);
    }

    // Function to set the developer royalty rate (in percentage)
    function setDeveloperRoyaltyRate(uint256 _royaltyRate) external {
        require(_royaltyRate <= 100, "Royalty rate cannot exceed 100%");
        developerRoyaltyRate = _royaltyRate;
    }

    //////
    // views
    //////

    // Function to get the total pool amount for a given matchId and result type
    // TODO:: optimize, this scales linearly with bets, probably can encapsulate bets into the match object
    function getTotalPoolAmountForResult(uint32 matchId, VersusResultType result) external view returns (uint256) {
        uint256 totalResultPool;
        for (uint32 i; i < matchToBets[matchId].length; i++) {
            uint32 betId = matchToBets[matchId][i];
            if (bets[betId].matchId == matchId && bets[betId].predictedResult == result) {
                totalResultPool += bets[i].amount;
            }
        }
        
        return totalResultPool;
    }

    // sugar function to get the total pool amount for a given matchId
    function getTotalPoolAmount(uint32 matchId) external view returns (uint256) {
        return totalPoolAmounts[matchId];
    }
}