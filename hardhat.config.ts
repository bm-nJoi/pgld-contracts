import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  networks: { 
    hardhat: {
      chainId: 1337
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        `FILL ME WITH PRIVKEY FROM LOCAL GANACHE`
      ]
    }
  },
  solidity: { compilers: [
    {
      version: "0.8.0"
    },
    {
      version: "0.8.9"
    },
    {
      version: "0.8.20"
    }
  ]}
};

export default config;
