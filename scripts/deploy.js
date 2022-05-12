const main = async () => {
	const domainContractFactory = await hre.ethers.getContractFactory("Domains");
	const domainContract = await domainContractFactory.deploy("regen");
	await domainContract.deployed();

	console.log("Contract deployed to:", domainContract.address);

	let txn = await domainContract.register("erick", {value: hre.ethers.utils.parseEther("0.1")});
	await txn.wait();
	console.log("Minted domain erick.regen");

	txn = await domainContract.setRecord("erick", "Am I a erick or a regen??");
	await txn.wait();
	console.log("Set record for erick.regen");

	const address = await domainContract.getAddress("erick");
	console.log("Owner of domain erick:", address);

	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
