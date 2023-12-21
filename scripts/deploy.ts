import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const [wallet1, wallet2] =
    await hre.viem.getWalletClients();
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = BigInt(currentTimestampInSeconds + 60);

  const lockedAmount = parseEther("0.001");

  const publicClient = await hre.viem.getPublicClient();
  const bobBalance = await publicClient.getBalance({
    address: wallet1.account.address,
  });

  console.log(
    `Balance of ${wallet1.account.address}: ${formatEther(
      bobBalance
    )} ETH`
  );
  // const wallet1bal = await publicClient.getBalance({
  //   address: wallet1.account.address,
  // });
  const token = await hre.viem.deployContract("TestGold");
  console.log(`TestGold  eployed at: ${token.address}`);

  const bgs = await hre.viem.deployContract("BattleAndGauntletContract");

  console.log(`BattleAndGauntlet stated eployed at: ${bgs.address}`);

  const smb = await hre.viem.deployContract("SimpleMatchBetting", [wallet1.account.address, bgs.address, token.address]);

  console.log(`Simple Match Bets deployed to: ${smb.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
