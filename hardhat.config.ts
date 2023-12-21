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
        `0xc3a01c9f4204ce76f669ebb9b335341d20b36e1d0b01bb279f0c3023c27426b7`,
        `0x909032ad6fc75d77f33c612946e902f343a5440bed16ef50e36a90fc41e27fc6`
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
