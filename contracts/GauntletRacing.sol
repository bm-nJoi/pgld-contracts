// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GauntletRacing {
    IERC20 private wagerToken;
    //address gauntletAddress;
    address treasuryAddress;
    uint256 public treasuryRoyaltyRate = 5;
    

    struct Race {
        address creator;
        address[] allowedRacers;
        address[] joinedRacers;
        mapping(address => uint256) racerSubmissions;
        address[] winners;
        string raceType; // "TIME_TRIAL" or "ROUND_RACE"
        uint256 wagerAmount;
        uint256 expirationTime; // in seconds from midnight UTC
        bool isStarted;
        bool isCompleted;
    }

    // raceIds start at 0
    mapping(uint256 => Race) public races;
    uint256 public nextRaceId;

    // racePools start at 0
    mapping(uint256 => uint256) public racePools;
    uint256 public treasuryPool;

    // Constants
    uint256 constant DEFAULT_EXPIRATION_TIME = 19 * 60 * 60; // 7 PM EST in seconds from midnight UTC

    // Events
    event RaceCreated(uint256 indexed raceId, address indexed creator, string indexed raceType, uint256 wagerAmount, uint256 expirationTime);
    event RaceStarted(uint256 indexed raceId);
    event RaceWon(uint256 indexed raceId, address indexed winner, uint256 winnings, uint256 completionTime);
    event RaceCompleted(uint256 indexed raceId, uint256 netPayout, bool isExpired);
    event RaceCancelled(uint256 indexed raceId);
    
    event JoinedRace(address indexed racer, uint256 indexed raceId);
    event LeftRace(address indexed racer, uint256 indexed raceId);
    event ScoreSubmitted(address indexed racer, uint256 indexed raceId, uint256 completionTime);

    constructor(address _wagerTokenAddress) {
        wagerToken = IERC20(_wagerTokenAddress);
    }

    // Create a new race
    function createRace(address[] memory _allowedRacers, string memory _raceType, uint256 _wagerAmount, uint256 _expirationTime) external {
        require(_wagerAmount > 0, "Wager amount must be greater than zero");
        require(_expirationTime > block.timestamp, "Expiration time must be greater than zero");
        // TODO :: validate _raceType

        uint256 raceId = nextRaceId++;
        Race storage race = races[raceId];
        race.creator = msg.sender;
        race.allowedRacers = _allowedRacers;
        race.raceType = _raceType;
        race.wagerAmount = _wagerAmount;
        race.expirationTime = _expirationTime == 0 ? DEFAULT_EXPIRATION_TIME : _expirationTime;
        race.isStarted = false;
        race.isCompleted = false;

        emit RaceCreated(raceId, msg.sender, _raceType, _wagerAmount, _expirationTime);
    }

    // Join a race
    function joinRace(uint256 _raceId) external {
        require(_raceId < nextRaceId, "Race does not exist");
        Race storage race = races[_raceId];
        // Check if the race has started
        require(!race.isStarted, "Race already started");

        // Check if the race is open or if the caller is in the allowed list
        require(race.allowedRacers.length == 0 || isInRacerList(race.allowedRacers, msg.sender), "Not allowed to join this race");

        // Mock: Check user's gauntlet state from an external contract
        // require(checkUserGauntletState(msg.sender), "Invalid user gauntlet state");

        // Transfer tokens as a wager
        require(wagerToken.transferFrom(msg.sender, address(this), race.wagerAmount), "Failed to transfer wager amount");

        race.joinedRacers.push(msg.sender);

        emit JoinedRace(msg.sender, _raceId);
    }

    function leaveRace(uint256 _raceId) external {
        require(_raceId < nextRaceId, "Race does not exist");
        Race storage race = races[_raceId];

        // Check if the race has started
        require(!race.isStarted, "Cannot leave race after it has started");

        // Check if the sender is actually part of the race
        require(isInRacerList(race.joinedRacers, msg.sender), "Not a participant of this race");

        // Remove the racer from the race
        removeRacerFromList(race.joinedRacers, msg.sender);

        // Refund half the wager amount, because QUITTERS ARE LAME
        uint256 refund = (race.wagerAmount / 2);
        require(wagerToken.transfer(msg.sender, refund), "Failed to refund wager amount");
        // give the other half to the devs, so this cant be manipulated to bully the pot
        treasuryPool += (race.wagerAmount - refund); //
        emit LeftRace(msg.sender, _raceId);
    }

    // Utility function to remove a racer from the list
    function removeRacerFromList(address[] storage _racers, address _racer) internal {
        uint length = _racers.length;
        for (uint i = 0; i < length; i++) {
            if (_racers[i] == _racer) {
                _racers[i] = _racers[length - 1];
                _racers.pop();
                return;
            }
        }
        revert("Racer not found");
    }

    // Start a race
    function startRace(uint256 _raceId) external {
        require(_raceId < nextRaceId, "Invalid raceId");
        Race storage race = races[_raceId];
        require(!race.isStarted, "Race already started");
        race.isStarted = true;
        emit RaceStarted(_raceId);
    }

    function submitScore(uint256 _raceId, address _racer, uint256 _completionTime) external {
        require(_raceId < nextRaceId, "Invalid raceId");
        Race storage race = races[_raceId];
        require(block.timestamp < race.expirationTime, "That race has expired, this score cannot be submitted.");
        address[] memory joinedRacers = race.joinedRacers;
        require((isInRacerList(joinedRacers, _racer) == true), "Racer not in race");
        require(race.isStarted && !race.isCompleted, "Race must be active");
        race.racerSubmissions[_racer] = _completionTime;
        emit ScoreSubmitted(_racer, _raceId, _completionTime);
    }

    // Complete a race
    function completeRace(uint256 _raceId, address[] memory _winners) external {
        require(_raceId < nextRaceId, "Invalid raceId");
        Race storage race = races[_raceId];
        require(race.isStarted, "Race not started");
        require(isRaceReadyToComplete(_raceId), "Race cannot be completed yet");
        race.isCompleted = true;

        // distribute based on expiration
        if (block.timestamp < race.expirationTime) {
            // complete race on time
            race.winners = _winners;
            // calculate winnings portions
            uint256 racePool = (race.wagerAmount * race.joinedRacers.length);
            uint256 treasuryRoyalty = (racePool * treasuryRoyaltyRate) / 100;
            wagerToken.transfer(address(this), treasuryRoyalty);
            treasuryPool += treasuryRoyalty;
            uint256 netPoolAmount = (racePool - treasuryRoyalty);

            uint256 winningsCut = (netPoolAmount / race.winners.length);
            for (uint256 i = 0; i < race.winners.length; i++) {
                address winner = race.winners[i];
                wagerToken.transfer(winner, winningsCut);
                emit RaceWon(_raceId, winner, winningsCut, race.racerSubmissions[winner]);
            }
            emit RaceCompleted(_raceId, netPoolAmount, false);
        } else {
            // complete race on expiration
            for (uint256 i = 0; i < race.joinedRacers.length; i++) {
                wagerToken.transfer(race.joinedRacers[i], race.wagerAmount);
            }
            emit RaceCompleted(_raceId, 0, true);
        }
    }

    // helper function to check if a racer is in a given racer set
    function isInRacerList(address[] memory _racers, address _racer) private pure returns (bool) {
        for (uint i = 0; i < _racers.length; i++) {
            if (_racers[i] == _racer) {
                return true;
            }
        }
        return false;
    }

    // // Mock function: Check user's gauntlet state
    // function checkUserGauntletState(address _user) private pure returns (bool) {
    //     // Replace with actual logic
    //     return true;
    // }

    // Mock function: Check if race can be completed
    function isRaceReadyToComplete(uint256 _raceId) public view returns (bool) {
        // check if all racers have submitted
        Race storage race = races[_raceId];
        // iterate submissions and check if all racers have submitted
        for (uint256 i = 0; i < race.joinedRacers.length; i++ ) {
            address racer = race.joinedRacers[i];
            if (race.racerSubmissions[racer] == 0) {
                return false;
            }
        }
        return true;
    }

    function getAllowedRacerAddresses(uint256 _raceId) public view returns (address[] memory) {
        return races[_raceId].allowedRacers;
    }

    function getRacers(uint256 _raceId) public view returns (address[] memory racers) {
        return races[_raceId].joinedRacers;
    }

    function getRaceWinners(uint256 _raceId) public view returns (address[] memory racers) {
        return races[_raceId].winners;
    }

    // returns 0 when racer is unsubmitted
    function getRacerSubmission(uint256 _raceId, address _racer) public view returns (uint256 submission) {
        Race storage race = races[_raceId];
        bool racerInRace = false;
        for (uint256 i = 0; i < race.joinedRacers.length; i++) {
            if (race.joinedRacers[i] == _racer) {
                racerInRace = true;
                break;
            }
        }
        require(racerInRace, "That racer is not in that race");
        return race.racerSubmissions[_racer];
    }

    function getRaceDetails(uint256 _raceId) public view returns (address creator, uint256 wagerAmount, uint256 expirationTime, bool isStarted, bool isCompleted) {
        require(_raceId < nextRaceId, "Invalid raceId");
        Race storage race = races[_raceId];
        return (race.creator, race.wagerAmount, race.expirationTime, race.isStarted, race.isCompleted);
    }

    function getNextRaceId() public view returns (uint256) {
        return nextRaceId;
    }

    function getWagerTokenAddress() public view returns (address) {
        return address(wagerToken);
    }

    function getTreasuryBalance() public view returns (uint256) {
        return treasuryPool;
    }
}
