// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BattleAndGauntletContract {
    struct BattleState {
        uint256 battleId;
        bool success;
    }

    struct GauntletState {
        uint256 gauntletId;
        uint8 progress; // 0: unstarted, 1-5: stages, 6: completed
    }

    mapping(uint256 => BattleState) public battleStates;
    mapping(uint256 => GauntletState) public gauntletStates;

    event BattleStateAdded(uint256 indexed battleId, bool success);
    event GauntletStateAdded(uint256 indexed gauntletId, uint8 progress);

    constructor() {
    }

    function addBattleState(uint256 _battleId, bool _success) external {
        BattleState memory newBattleState = BattleState(_battleId, _success);
        battleStates[_battleId] = newBattleState;
        emit BattleStateAdded(_battleId, _success);
    }

    function addGauntletState(uint256 _gauntletId, uint8 _progress) external {
        require(_progress <= 6, "Progress must be between 0 and 6");
        GauntletState memory newGauntletState = GauntletState(_gauntletId, _progress);
        gauntletStates[_gauntletId] = newGauntletState;
        emit GauntletStateAdded(_gauntletId, _progress);
    }

    function getBattleState(uint256 _battleId) external view returns (BattleState memory) {
        return battleStates[_battleId];
    }

    function getGauntletState(uint256 _gauntletId) external view returns (GauntletState memory) {
        return gauntletStates[_gauntletId];
    }
}
