import { formatEther, parseEther } from "viem";
import hre from "hardhat";
import { getContract } from "viem";
import { TestGoldABI } from "./TestGold";
import { publicClient } from "./client";

async function main() {
  const [wallet1, wallet2] =
    await hre.viem.getWalletClients();

  const tmb = await hre.viem.getContractAt("TestMatchBetting", "0xa567350c744f1074e737f52153c866130996b6e9");
  const blockTime = (await (await hre.viem.getPublicClient()).getBlock()).timestamp;
  try { await tmb.write.startMatch([0, BigInt(Date.now()+5000000)]); // INVALID RANGE }
} catch (e) { console.log(e); }
try {
  await tmb.write.startMatch([5, blockTime + BigInt(5000000)]); // VALID BOTH
} catch (e) { console.log(e); }
try {
  await tmb.write.startMatch([5, BigInt(blockTime - BigInt(50000000))]); // INVALID TIME
} catch (e) { console.log(e); }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
