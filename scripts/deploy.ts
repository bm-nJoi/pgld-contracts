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

  const bgs = await hre.viem.deployContract("BGStateContract");

  console.log(`BattleAndGauntlet stated eployed at: ${bgs.address}`);

  const smb = await hre.viem.deployContract("SimpleMatchBetting", [wallet1.account.address, bgs.address, token.address]);
  const tmb = await hre.viem.deployContract("TestMatchBetting", [wallet1.account.address, token.address])
  console.log(`Simple Match Bets deployed to: ${smb.address}`);
  console.log(`Test Match Bets deployed to: ${tmb.address}`);
  await token.write.mint([(10000 * 1e18)]);
  await token.write.transfer([wallet1.account.address, (1000 * 1e18)]);
  await token.write.transfer([wallet2.account.address, (1000 * 1e18)]);
  await token.write.transfer(['0x54a4A021C2FA8A5d5D5B9272e488E2654591c8e6', (1000 * 1e18)]);
  await bgs.write.addBattleState(['1', false]);
  await bgs.write.addBattleState(['2', true]);
  await bgs.write.addGauntletState(['1', 0]);
  await bgs.write.addGauntletState(['2', 3]);
  await bgs.write.addGauntletState(['3', 6]);
  await smb.write.startMatch([6, BigInt(Date.now()+50505050)]);
  await tmb.write.startMatch([6, BigInt(Date.now()+50505050)]);
  await wallet1.writeContract({
    address: token.address,
    abi: token.abi,
    functionName: 'approve',
    args: [smb.address, BigInt(10000 * 1e18)]
  })
  await wallet1.writeContract({
    address: tmb.address,
    abi: tmb.abi,
    functionName: 'placeBet',
    args:[ BigInt(0), BigInt(500 * 1e18), BigInt(1)]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
