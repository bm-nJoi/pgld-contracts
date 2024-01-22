import hre from "hardhat";
import { assert, expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("GauntletRacing Contract Tests", function () {
    let gr, tg;
    let _wallet1, _wallet2;

    before(async function () {
        const [wallet1, wallet2] = await hre.viem.getWalletClients();
        _wallet1 = wallet1;
        _wallet2 = wallet2;
        tg = await hre.viem.deployContract("TestGold");
        await tg.write.mint([BigInt(10000 * 10 ** 18)]);
        await tg.write.transfer([wallet1.account.address, BigInt(5000 * 10 ** 18)]);
        await tg.write.transfer([wallet2.account.address, BigInt(5000 * 10 ** 18)]);
        await wallet1.writeContract({
            address: tg.address,
            abi: tg.abi,
            functionName: 'approve',
            args: [tg.address, BigInt(10000 * 10 ** 18)]
        })
        await wallet2.writeContract({
            address: tg.address,
            abi: tg.abi,
            functionName: 'approve',
            args: [tg.address, BigInt(10000 * 10 ** 18)]
        })

        gr = await hre.viem.deployContract("GauntletRacing", [tg.address]);
    });

    it("should fail to create a race that's expired or has no wager", async function () {
        let racers = [_wallet1.account.address];
        
        await expect(gr.write.createRace([racers, "TIME_TRIAL", 500, 0]))
        .to.be.rejectedWith('Expiration time must be greater than zero');
        
        await expect(gr.write.createRace([racers, "TIME_TRIAL", 0, 1705529539]))
        .to.be.rejectedWith('Wager amount must be greater than zero');
    });

    it("should allow a user to create a race", async function () {
        let racers = [_wallet1.account.address];
        
        await gr.write.createRace([racers, "TIME_TRIAL", 500, 1706529539 ]);
        const details = await gr.read.getRaceDetails([0]);
        console.error(details);
        assert.equal(details[0].toLowercase(), _wallet1.account.address);
        assert.equal(details[1], 500);
        assert.equal(details[2], 1705529555);
        assert.equal(details[3], false);
        assert.equal(details[4], false);
    });

    // it("should allow a user to join an open race", async function () {
    //     // Setup race
    //     // Call joinRace
    //     // Validate user joined
    // });
    
    // it("should fail if a user tries to join a race that doesn't exist", async function () {
    //     // Attempt to join a non-existent race
    //     // Expect failure
    // });
    
    // it("should allow a user to leave a race and receive a refund", async function () {
    //     // Setup and join race
    //     // Leave race
    //     // Validate refund and race update
    // });
    
    // it("should fail if a user tries to leave a race after it has started", async function () {
    //     // Start race
    //     // Attempt to leave race
    //     // Expect failure
    // });
    
    // it("should allow a race to be started", async function () {
    //     // Setup race
    //     // Start race
    //     // Validate race started
    // });

    // it("should complete a race and distribute winnings", async function () {
    //     // Setup and start race
    //     // Complete race
    //     // Validate completion and payouts
    // });

});