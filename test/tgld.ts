import hre from "hardhat";
import { assert, expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

// A deployment function to set up the initial state
const deploy = async () => {
  const testGold = await hre.viem.deployContract("TestGold");

  return { testGold };
};

describe("TestGold Contract Tests", function () {
  it("should increase supply correctly", async function () {
    // Load the contract instance using the deployment function
    const { testGold } = await loadFixture(deploy);

    // Get the initial supply
    const initialSupply = await testGold.read.getCurrentSupply();

    // Increase the supply
    await testGold.write.mint([500_000n]);

    // Get the new supply after the increase
    const newSupply = await testGold.read.getCurrentSupply();

    // Assert that the supply increased as expected
    assert.equal(initialSupply + 500_000n, newSupply);
  });

  it("should revert when increasing supply by less than 1", async function () {
    // Load the contract instance using the deployment function
    const { testGold } = await loadFixture(deploy);

    // Attempt to increase supply by 0 (which should fail)
    await expect(testGold.write.mint([0n])).to.be.rejectedWith(
      "Cannot mint nothing, amount of 0 is invalid."
    );
  });
});