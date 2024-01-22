export const SimpleMatchBettingABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_battleAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_treasuryAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_wagerToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "betId",
        "type": "uint32"
      }
    ],
    "name": "BetCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "betId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BetPayout",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "betId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "predictedResult",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "resultRange",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "expired",
        "type": "bool"
      }
    ],
    "name": "MatchEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "resultRange",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "expirationTime",
        "type": "uint256"
      }
    ],
    "name": "MatchStarted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "betCounter",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "name": "bets",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "result",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "enum SimpleMatchBetting.BetState",
        "name": "state",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "betId",
        "type": "uint32"
      }
    ],
    "name": "cancelBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "betId",
        "type": "uint32"
      }
    ],
    "name": "getBet",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "id",
            "type": "uint32"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "matchId",
            "type": "uint32"
          },
          {
            "internalType": "uint8",
            "name": "result",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "enum SimpleMatchBetting.BetState",
            "name": "state",
            "type": "uint8"
          }
        ],
        "internalType": "struct SimpleMatchBetting.Bet",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "betId",
        "type": "uint32"
      }
    ],
    "name": "getBetsForMatch",
    "outputs": [
      {
        "internalType": "uint32[]",
        "name": "",
        "type": "uint32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDevPoolAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      }
    ],
    "name": "getMatch",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "id",
            "type": "uint32"
          },
          {
            "internalType": "uint8",
            "name": "resultRange",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "result",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "complete",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "expirationTime",
            "type": "uint256"
          }
        ],
        "internalType": "struct SimpleMatchBetting.Match",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMatches",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "id",
            "type": "uint32"
          },
          {
            "internalType": "uint8",
            "name": "resultRange",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "result",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "complete",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "expirationTime",
            "type": "uint256"
          }
        ],
        "internalType": "struct SimpleMatchBetting.Match[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      }
    ],
    "name": "getTotalPoolAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "result",
        "type": "uint8"
      }
    ],
    "name": "getTotalPoolAmountForResult",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getUserBetHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "id",
            "type": "uint32"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "internalType": "uint32",
            "name": "matchId",
            "type": "uint32"
          },
          {
            "internalType": "uint8",
            "name": "result",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "enum SimpleMatchBetting.BetState",
            "name": "state",
            "type": "uint8"
          }
        ],
        "internalType": "struct SimpleMatchBetting.Bet[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getUserPoolAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "matchCounter",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "matchToBets",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "name": "matches",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "id",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "resultRange",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "result",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "complete",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "expirationTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "predictedResult",
        "type": "uint8"
      }
    ],
    "name": "placeAnotherBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "predictedResult",
        "type": "uint8"
      }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "matchId",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "actualResult",
        "type": "uint8"
      }
    ],
    "name": "processResults",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_royaltyRate",
        "type": "uint256"
      }
    ],
    "name": "setTreasuryRoyaltyRate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "resultRange",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "expirationTime",
        "type": "uint256"
      }
    ],
    "name": "startMatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDevPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "name": "totalPoolAmounts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasuryRoyaltyRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userPoolAmounts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userToBets",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wagerToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "withdrawTo",
        "type": "address"
      }
    ],
    "name": "withdrawDevTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawUserPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;