import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
    const [wallet1] = await hre.viem.getWalletClients();
    const token = await hre.viem.deployContract("TestGold");
    console.log(`TestGold  eployed at: ${token.address}`);
    const gr = await hre.viem.deployContract("GauntletRacing", [token.address]);
    console.log(`GauntletRacing  eployed at: ${gr.address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  