export const TestGoldABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
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
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
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
    "name": "balanceOf",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
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
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "getAllowance",
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
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getBalanceOf",
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
    "name": "getCurrentSupply",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const TestGoldBytecode = '0x60806040526040518060400160405280600981526020017f5465737420476f6c640000000000000000000000000000000000000000000000815250600390816200004a919062000325565b506040518060400160405280600481526020017f54474c44000000000000000000000000000000000000000000000000000000008152506004908162000091919062000325565b506012600555348015620000a457600080fd5b506200040c565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200012d57607f821691505b602082108103620001435762000142620000e5565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620001ad7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200016e565b620001b986836200016e565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200020662000200620001fa84620001d1565b620001db565b620001d1565b9050919050565b6000819050919050565b6200022283620001e5565b6200023a62000231826200020d565b8484546200017b565b825550505050565b600090565b6200025162000242565b6200025e81848462000217565b505050565b5b8181101562000286576200027a60008262000247565b60018101905062000264565b5050565b601f821115620002d5576200029f8162000149565b620002aa846200015e565b81016020851015620002ba578190505b620002d2620002c9856200015e565b83018262000263565b50505b505050565b600082821c905092915050565b6000620002fa60001984600802620002da565b1980831691505092915050565b6000620003158383620002e7565b9150826002028217905092915050565b6200033082620000ab565b67ffffffffffffffff8111156200034c576200034b620000b6565b5b62000358825462000114565b620003658282856200028a565b600060209050601f8311600181146200039d576000841562000388578287015190505b62000394858262000307565b86555062000404565b601f198416620003ad8662000149565b60005b82811015620003d757848901518255600182019150602085019450602081019050620003b0565b86831015620003f75784890151620003f3601f891682620002e7565b8355505b6001600288020188555050505b505050505050565b610f93806200041c6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80634f3e1efc1161008c5780639b96eece116100665780639b96eece14610261578063a0712d6814610291578063a9059cbb146102ad578063dd62ed3e146102dd576100ea565b80634f3e1efc146101f557806370a082311461021357806395d89b4114610243576100ea565b806318160ddd116100c857806318160ddd1461016d57806323b872dd1461018b578063313ce567146101bb57806342966c68146101d9576100ea565b806306fdde03146100ef578063095ea7b31461010d5780630af4187d1461013d575b600080fd5b6100f761030d565b6040516101049190610b8c565b60405180910390f35b61012760048036038101906101229190610c47565b61039b565b6040516101349190610ca2565b60405180910390f35b61015760048036038101906101529190610cbd565b61048d565b6040516101649190610d0c565b60405180910390f35b610175610514565b6040516101829190610d0c565b60405180910390f35b6101a560048036038101906101a09190610d27565b61051a565b6040516101b29190610ca2565b60405180910390f35b6101c36106cb565b6040516101d09190610d0c565b60405180910390f35b6101f360048036038101906101ee9190610d7a565b6106d1565b005b6101fd6107a8565b60405161020a9190610d0c565b60405180910390f35b61022d60048036038101906102289190610da7565b6107b1565b60405161023a9190610d0c565b60405180910390f35b61024b6107c9565b6040516102589190610b8c565b60405180910390f35b61027b60048036038101906102769190610da7565b610857565b6040516102889190610d0c565b60405180910390f35b6102ab60048036038101906102a69190610d7a565b6108a0565b005b6102c760048036038101906102c29190610c47565b6109ba565b6040516102d49190610ca2565b60405180910390f35b6102f760048036038101906102f29190610cbd565b610ad7565b6040516103049190610d0c565b60405180910390f35b6003805461031a90610e03565b80601f016020809104026020016040519081016040528092919081815260200182805461034690610e03565b80156103935780601f1061036857610100808354040283529160200191610393565b820191906000526020600020905b81548152906001019060200180831161037657829003601f168201915b505050505081565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161047b9190610d0c565b60405180910390a36001905092915050565b6000600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60005481565b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105a89190610e63565b9250508190555081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105fe9190610e63565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546106549190610e97565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106b89190610d0c565b60405180910390a3600190509392505050565b60055481565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107209190610e63565b92505081905550806000808282546107389190610e63565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161079d9190610d0c565b60405180910390a350565b60008054905090565b60016020528060005260406000206000915090505481565b600480546107d690610e03565b80601f016020809104026020016040519081016040528092919081815260200182805461080290610e03565b801561084f5780601f106108245761010080835404028352916020019161084f565b820191906000526020600020905b81548152906001019060200180831161083257829003601f168201915b505050505081565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600081116108e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108da90610f3d565b60405180910390fd5b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546109329190610e97565b925050819055508060008082825461094a9190610e97565b925050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516109af9190610d0c565b60405180910390a350565b600081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610a0b9190610e63565b9250508190555081600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610a619190610e97565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610ac59190610d0c565b60405180910390a36001905092915050565b6002602052816000526040600020602052806000526040600020600091509150505481565b600081519050919050565b600082825260208201905092915050565b60005b83811015610b36578082015181840152602081019050610b1b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610b5e82610afc565b610b688185610b07565b9350610b78818560208601610b18565b610b8181610b42565b840191505092915050565b60006020820190508181036000830152610ba68184610b53565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610bde82610bb3565b9050919050565b610bee81610bd3565b8114610bf957600080fd5b50565b600081359050610c0b81610be5565b92915050565b6000819050919050565b610c2481610c11565b8114610c2f57600080fd5b50565b600081359050610c4181610c1b565b92915050565b60008060408385031215610c5e57610c5d610bae565b5b6000610c6c85828601610bfc565b9250506020610c7d85828601610c32565b9150509250929050565b60008115159050919050565b610c9c81610c87565b82525050565b6000602082019050610cb76000830184610c93565b92915050565b60008060408385031215610cd457610cd3610bae565b5b6000610ce285828601610bfc565b9250506020610cf385828601610bfc565b9150509250929050565b610d0681610c11565b82525050565b6000602082019050610d216000830184610cfd565b92915050565b600080600060608486031215610d4057610d3f610bae565b5b6000610d4e86828701610bfc565b9350506020610d5f86828701610bfc565b9250506040610d7086828701610c32565b9150509250925092565b600060208284031215610d9057610d8f610bae565b5b6000610d9e84828501610c32565b91505092915050565b600060208284031215610dbd57610dbc610bae565b5b6000610dcb84828501610bfc565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610e1b57607f821691505b602082108103610e2e57610e2d610dd4565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610e6e82610c11565b9150610e7983610c11565b9250828203905081811115610e9157610e90610e34565b5b92915050565b6000610ea282610c11565b9150610ead83610c11565b9250828201905080821115610ec557610ec4610e34565b5b92915050565b7f43616e6e6f74206d696e74206e6f7468696e672c20616d6f756e74206f66203060008201527f20697320696e76616c69642e0000000000000000000000000000000000000000602082015250565b6000610f27602c83610b07565b9150610f3282610ecb565b604082019050919050565b60006020820190508181036000830152610f5681610f1a565b905091905056fea2646970667358221220469cf60afc9b9af95b150b67182f75e1f47806226b65ab02cd2cf4508fc2f52a64736f6c63430008140033' as const;