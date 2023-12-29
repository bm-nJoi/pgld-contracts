import { formatEther, parseEther } from "viem";
import hre from "hardhat";
import { getContract } from "viem";
import { TestGoldABI } from "./TestGold";
import { publicClient } from "./client";

async function main() {
  const [wallet1, wallet2] =
    await hre.viem.getWalletClients();

  const testGold = await hre.viem.getContractAt("TestGold", "0xbce47e1974ff597e6d585c9338cfe9e0288ff073");
  
  let supply = await testGold.read.getCurrentSupply();
  console.log(supply);

  await testGold.write.mint([BigInt(10000 * 1e18)]);
  let supply2 = await testGold.read.getCurrentSupply();
  console.log(supply2);
  let goldTransferAmount = (1000 * 1e18);

  let transfer = await testGold.write.transfer(['0xD69053cf967c80d5ac5a0e4e1Cb9AF9a87e9f047', goldTransferAmount]);
  console.log(`transfer tx : ${transfer})`);

  // let wallet2balance = await testGold.read.getBalanceOf(['0x54a4A021C2FA8A5d5D5B9272e488E2654591c8e6']);
  // console.log(wallet2balance);
  // let ethXfer = BigInt(1 * 1e18);
  // let transferEth = await wallet1.sendTransaction({
  //     account: wallet1.account,
  //     to: '0x54a4A021C2FA8A5d5D5B9272e488E2654591c8e6',
  //     value: ethXfer,
  // })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
