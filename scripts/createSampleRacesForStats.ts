import { formatEther, parseEther } from "viem";
import hre from "hardhat";
import { getContract } from "viem";
import { TestGoldABI } from "./TestGold";
import { publicClient } from "./client";
const now = 1705429539;

async function main() {
  const [wallet1, wallet2, wallet3, wallet4, wallet5] = await hre.viem.getWalletClients();

  const testGold = await hre.viem.getContractAt("TestGold", "0xed97e88f10ec6775cf1372fc6da3b5e4087315e6");
  await testGold.write.mint([BigInt(1000000 * 1e18)]);
  let goldTransferAmount = (1000 * 1e18);
  let transfer = await testGold.write.transfer([wallet1.account.address, goldTransferAmount]);
  let transfer2 = await testGold.write.transfer([wallet2.account.address, goldTransferAmount]);
   await testGold.write.transfer([wallet3.account.address, goldTransferAmount]);

  await testGold.write.transfer([wallet4.account.address, goldTransferAmount]);

  await testGold.write.transfer([wallet5.account.address, goldTransferAmount]);


  const gr = await hre.viem.getContractAt("GauntletRacing", "0xe6a174a91a4b1dd829e2b9cc4e6fbe32a330b698"); 
  // approve tg to gr contract
  await wallet2.writeContract({
    address: testGold.address,
    abi: testGold.abi,
    functionName: 'approve',
    args: [gr.address, BigInt(10000 * 1e18)]
  });
  // approve tg to gr contract
  await wallet3.writeContract({
    address: testGold.address,
    abi: testGold.abi,
    functionName: 'approve',
    args: [gr.address, BigInt(10000 * 1e18)]
  });
  // approve tg to gr contract
  await wallet4.writeContract({
    address: testGold.address,
    abi: testGold.abi,
    functionName: 'approve',
    args: [gr.address, BigInt(10000 * 1e18)]
  });
  // approve tg to gr contract
  await wallet5.writeContract({
    address: testGold.address,
    abi: testGold.abi,
    functionName: 'approve',
    args: [gr.address, BigInt(10000 * 1e18)]
  });

  const racers = [wallet2.account.address];
  // create race
  await gr.write.createRace([racers, "TIME_TRIAL", 500, 1705529539 ]);
  
  // join race
  let newRaceId = (await gr.read.getNextRaceId()) - BigInt(1);
  await wallet2.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  // start race
  await gr.write.startRace([newRaceId]);
  // submit score 
  await gr.write.submitScore([newRaceId, wallet2.account.address, 300]);
  // complete race
  await gr.write.completeRace([newRaceId, [wallet2.account.address]]);

  const racers2 = [wallet2.account.address,wallet3.account.address,wallet4.account.address];
  // create race
  await gr.write.createRace([racers2, "TIME_TRIAL", 500, 1705529539 ]);
  
  // join race
   newRaceId = (await gr.read.getNextRaceId()) - BigInt(1);
  await wallet2.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  await wallet3.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  await wallet4.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  // start race
  await gr.write.startRace([newRaceId]);
  // submit score 
  let score1 = BigInt(Math.floor(Math.random() * 500));
  let score2 = BigInt(Math.floor(Math.random() * 500));
  let score3 = BigInt(Math.floor(Math.random() * 500));
  await gr.write.submitScore([newRaceId, wallet2.account.address, score1]);
  await gr.write.submitScore([newRaceId, wallet3.account.address, score2]);
  await gr.write.submitScore([newRaceId, wallet4.account.address, score3]);

  // complete race
  await gr.write.completeRace([newRaceId, [wallet3.account.address]]);

  const racers3 = [wallet5.account.address,wallet3.account.address,wallet4.account.address];
  // create race
  await gr.write.createRace([racers3, "TIME_TRIAL", 500, 1705529539 ]);
  
  // join race
   newRaceId = (await gr.read.getNextRaceId()) - BigInt(1);
  await wallet5.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  await wallet3.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  await wallet4.writeContract({
    address: gr.address,
    abi: gr.abi,
    functionName: 'joinRace',
    args: [newRaceId] // check current race id and set it based on that?
  });
  // start race
  await gr.write.startRace([newRaceId]);
  // submit score 
   score1 = BigInt(Math.floor(Math.random() * 500));
   score2 = BigInt(Math.floor(Math.random() * 500));
   score3 = BigInt(Math.floor(Math.random() * 500));
  await gr.write.submitScore([newRaceId, wallet5.account.address, score1]);
  await gr.write.submitScore([newRaceId, wallet3.account.address, score2]);
  await gr.write.submitScore([newRaceId, wallet4.account.address, score3]);

  // complete race
  await gr.write.completeRace([newRaceId, [wallet5.account.address]]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
