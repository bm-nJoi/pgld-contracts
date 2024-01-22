import { formatEther, parseEther } from "viem";
import hre from "hardhat";
import { getContract } from "viem";
import { TestGoldABI } from "./TestGold";
import { publicClient } from "./client";

async function main() {
  const [wallet1, wallet2] =
    await hre.viem.getWalletClients();

  const testGold = await hre.viem.getContractAt("TestGold", "0xed97e88f10ec6775cf1372fc6da3b5e4087315e6");
  
  let supply = await testGold.read.getCurrentSupply();
  console.log(supply);

  await testGold.write.mint([BigInt(10000 * 1e18)]);
  let supply2 = await testGold.read.getCurrentSupply();
  console.log(supply2);
  let goldTransferAmount = (1000 * 1e18);

  let transfer = await testGold.write.transfer([wallet1.account.address, goldTransferAmount]);
  console.log(`transfer tx : ${transfer})`);
  let transfer2 = await testGold.write.transfer([wallet2.account.address, goldTransferAmount]);
  console.log(`transfer tx : ${transfer2})`);


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
