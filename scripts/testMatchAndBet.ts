import { formatEther, parseEther } from "viem";
import hre from "hardhat";
import { getContract } from "viem";
import { TestGoldABI } from "./TestGold";
import { publicClient } from "./client";

async function main() {
  const [wallet1, wallet2] =
    await hre.viem.getWalletClients();

  const tmb = await hre.viem.getContractAt("TestMatchBetting", "0x5df23b8a24ef952c32b63638512c38de1e21c920");
  const mc = await tmb.read.getMatchCounter();
  const bc = await tmb.read.getBetCounter();
  console.log(mc);
  console.log(bc);
  await tmb.write.startMatch([5, Date.now()+10000]);
  await tmb.write.placeBet([5, 10, 20]);
  await tmb.write.placeBet([10, 5, 15]);
  const mc2 = await tmb.read.getMatchCounter();
  const bc2 = await tmb.read.getBetCounter();
  console.log(mc2);
  console.log(bc2);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
