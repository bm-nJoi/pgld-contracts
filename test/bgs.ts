import hre from "hardhat";
import { assert, expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

// A deployment function to set up the initial state
const deploy = async () => {
    const [wallet1, wallet2] =
    await hre.viem.getWalletClients();
    const bgs = await hre.viem.deployContract("BattleAndGauntletContract");
    return { bgs }
};

describe("Battle and Gauntlet Contract Tests", function () {
  it("should add a BattleState when provided an id and success result ", async function () {
    const { bgs } = await loadFixture(deploy);
    await bgs.write.addBattleState(['1', false]);
    await bgs.write.addBattleState(['2', true]);
    const bs1 = await bgs.read.getBattleState([1]);
    const bs2 = await bgs.read.getBattleState([2]);
    assert.equal(bs1.success,  false);
    assert.equal(bs2.success,  true);
  })

  it("should add a GauntletState when provided an id and progress ", async function () {
    const { bgs } = await loadFixture(deploy);
    await bgs.write.addGauntletState(['1', 0]);
    await bgs.write.addGauntletState(['2', 6]);
    const gs1 = await bgs.read.getGauntletState([1]);
    const gs2 = await bgs.read.getGauntletState([2]);
    assert.equal(gs1.progress,  0);
    assert.equal(gs2.progress,  6);
  })
  it("should add fail to add a GauntletState when provided an invalid progress ", async function () {
    const { bgs } = await loadFixture(deploy);
    await expect (bgs.write.addGauntletState(['3', 9])).to.be.rejectedWith(
        "Progress must be between 0 and 6"
    );
  })
});