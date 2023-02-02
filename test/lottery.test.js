const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { minutes } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time/duration");
const { ethers } = require("hardhat");

describe("Lottery", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        const Lottery = await ethers.getContractFactory("Lottery");
        const lottery = await Lottery.deploy();

        return { lottery, owner, otherAccount };
    }

    // Start of Tests

    describe("Deployment", function () {
        it("Should set the right player count and start time", async function () {
            const { lottery } = await loadFixture(deployFixture);

            expect(await lottery.playerCount()).to.equal(0);
            expect(await lottery.endTime()).to.equal(await time.latest() + minutes(30));
        });
    });

    describe("Purchases", function () {
        it("Should throw error for wrong ticket price", async function () {
            const { lottery, otherAccount } = await loadFixture(deployFixture);

            await expect(lottery.connect(otherAccount).purchaseTicket({ value: 2 }))
                .to.be.revertedWith("Incorrect ticket price");
        });

        it("Should throw error if owner enters", async function () {
            const { lottery } = await loadFixture(deployFixture);

            await expect(lottery.purchaseTicket({ value: ethers.utils.parseUnits("1", "ether") }))
                .to.be.revertedWith("Owner can not enter lottery");
        });
    });

    describe("Winner Selection", function () {
        it("Should throw error if lottery is live", async function () {
            const { lottery } = await loadFixture(deployFixture);

            await expect(lottery.selectWinner()).to.be.revertedWith("Lottery has not ended");
        });

        it("Should throw error if non-owner enters", async function () {
            const { lottery, otherAccount } = await loadFixture(deployFixture);

            time.increaseTo(await time.latest() + minutes(30));

            await expect(lottery.connect(otherAccount).selectWinner()).to.be.revertedWith("Only the owner can select the winner");
        });
    });

    // End of Tests
});