import hre from "hardhat";
import { assert, expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

// A deployment function to set up the initial state
// NOTE: this is called on every iteration, because the types coming out of viem'
// are needed for wallet calls, but saving them into local variables doesnt persist type
// between iterations, so it cant make a .read or .write call on that saved reference to the viem contract because it does not know type
const deploy = async () => {
  const [wallet1, wallet2] = await hre.viem.getWalletClients();

  // deploy contracts
  const tg = await hre.viem.deployContract("TestGold");
  const bgs = await hre.viem.deployContract("BattleAndGauntletContract");
  const smb = await hre.viem.deployContract("SimpleMatchBetting", [bgs.address, wallet1.account.address, tg.address]);
  // send over some gold to the 2 betters for use in tests
  await tg.write.mint([10000]);
  await tg.write.transfer([wallet1.account.address, 1000]);
  await tg.write.transfer([wallet2.account.address, 1000]);
  // set up some battlestate and gauntletstate
  await bgs.write.addBattleState(['1', false]);
  await bgs.write.addBattleState(['2', true]);
  await bgs.write.addGauntletState(['1', 0]);
  await bgs.write.addGauntletState(['2', 3]);
  await bgs.write.addGauntletState(['3', 6]);
  await smb.write.startMatch([6, BigInt(Date.now()+505050505050)]);
  await wallet1.writeContract({
    address: tg.address,
    abi: tg.abi,
    functionName: 'approve',
    args: [smb.address, 10000]
  })
  await wallet2.writeContract({
    address: tg.address,
    abi: tg.abi,
    functionName: 'approve',
    args: [smb.address, 10000]
  })

  return { tg, bgs, smb };
};

describe("SimpleMatchBetting Contract Tests", function () {
  it("should start a match with result range specified and expiration time specified", async function () {
    const { smb } = await loadFixture(deploy);
    await smb.write.startMatch([4, BigInt(Date.now()+505050505050)]);
    
    const match0Details = await smb.read.getMatch([1]);
    assert.equal(match0Details.resultRange, 4);
    
    const matchPool = await smb.read.getTotalPoolAmount([1]);
    assert.equal(matchPool, 0);
  })

  it("should allow a player to bet on a match", async function () {
    const { smb, tg } = await loadFixture(deploy);
    const [wallet1, wallet2] = await hre.viem.getWalletClients();
    await smb.write.startMatch([6, BigInt(Date.now()+505050505050)]);

    const hash = await wallet1.writeContract({
      address: smb.address,
      abi: smb.abi,
      functionName: 'placeBet',
      args: [0, BigInt(500), 1]
    });

    const newMatchPool = await smb.read.getTotalPoolAmount([0]);
    const newUserPool = await smb.read.getUserPoolAmount([wallet1.account.address]);

    console.log(`matchPool: ${newMatchPool}`);
    console.log(`matchPool: ${newUserPool}`);

    assert.equal(newMatchPool, 500);
    assert.equal(newUserPool, 0);
  })

  it("should reward the winning player with the pool, minus the dev fee", async function () {
    const { smb, tg } = await loadFixture(deploy);
    const [wallet1, wallet2] = await hre.viem.getWalletClients();
    const w1bal = await tg.read.getBalanceOf([wallet1.account.address]);
    console.log("wallet1 initial bal:" + w1bal)
    const w2bal = await tg.read.getBalanceOf([wallet2.account.address]);
    console.log("wallet2 initial bal:" + w2bal);
    await wallet1.writeContract({
      address: smb.address,
      abi: smb.abi,
      functionName: 'placeBet',
      args: [0, BigInt(500), 1]
    });
    await wallet2.writeContract({
      address: smb.address,
      abi: smb.abi,
      functionName: 'placeBet',
      args: [0, BigInt(500), 3]
    });
    const currPool = await smb.read.getTotalPoolAmount([0]);
    console.log("bets placed, 500 each, pool is set to:" + currPool);
    await smb.write.processResults([0, 3]);
    const bet1 = await smb.read.getBet([1]);
    const match1 = await smb.read.getMatch([0]);
    const leftoverPool = await smb.read.getTotalPoolAmount([0]);
    const devPool = await smb.read.getDevPoolAmount();
    const user1Pool = await smb.read.getUserPoolAmount([wallet1.account.address]);
    const user2Pool = await smb.read.getUserPoolAmount([wallet2.account.address]);
    console.log(`user1Winnings: ${user1Pool}`);
    console.log(`user2Winnings: ${user2Pool}`);
    console.log(`leftoverPool: ${leftoverPool}`);
    console.log(`devPool: ${devPool}`);
    assert.equal(user1Pool, 0);
    assert.equal(user2Pool, 950);
    assert.equal(leftoverPool, 0);
    assert.equal(devPool, 50);
    
    
    await wallet2.writeContract({
      address: smb.address,
      abi: smb.abi,
      functionName: 'withdrawUserPool'
    });
    console.log(`withdrawing user2Winnings: ${user2Pool}`);
    const wal2_2 = await tg.read.getBalanceOf([wallet2.account.address]);
    console.log("winners final bal:" + wal2_2);
    const wal1_2 = await tg.read.getBalanceOf([wallet1.account.address]);
    console.log("losers final bal:" + wal1_2);
  })
});