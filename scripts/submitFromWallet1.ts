import { formatEther, parseEther } from "viem";
import hre from "hardhat";
import { getContract } from "viem";
import { TestGoldABI } from "./TestGold";
import { publicClient } from "./client";

async function main() {
  const [wallet2] =
    await hre.viem.getWalletClients();

  const testGold = await hre.viem.getContractAt("TestGold", "0xed97e88f10ec6775cf1372fc6da3b5e4087315e6");
  const gr = await hre.viem.getContractAt("GauntletRacing", "0xe6a174a91a4b1dd829e2b9cc4e6fbe32a330b698"); 
  // gr.write.submitScore([1, wallet1.account.address, 300]);
  const rdetails = await gr.read.getRaceDetails([2]);
  console.log(rdetails);
  const winners = await gr.read.getRaceWinners([2]);
  console.log(winners);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
