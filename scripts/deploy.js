const hre = require("hardhat");

async function main() {
	try {
		const Lottery = await hre.ethers.getContractFactory("Lottery");
		const lottery = await Lottery.deploy();

		await lottery.deployed();

		console.log(`Lottery is deployed at ${lottery.address}`);
	} catch (error) {
		console.error(`Error deploying the Lottery contract: ${error.message}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});