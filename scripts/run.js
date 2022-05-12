const main = async () => {
	const domainContractFactory = await hre.ethers.getContractFactory("Domains");

	// We pass in "regen" to the constructor when deploying
	const domainContract = await domainContractFactory.deploy("regen");
	await domainContract.deployed();

	console.log("Contract deployed to:", domainContract.address);
	// console.log("Contract deployed by:", owner.address);

	// We're passing in a second variable - value. This is the moneyyyyyyyyyy
	let txn = await domainContract.register("regen", {value: hre.ethers.utils.parseEther("0.1")});

	await txn.wait();

	const address = await domainContract.getAddress("regen");
	console.log("Owner of domain regen:", address);

	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

	/**
	 * Old
	 */
	txn = await domainContract.setRecord("regen", "https://twitter.com/wrecsx");
	await txn.wait();
	let record = await domainContract.getRecord("regen");
	console.log("Record:", record);

	// Trying to set a record that doesn't belong to me!
	// txn = await domainContract.connect(randomPerson).setRecord("regen", "Haha my domain now!");
	// await txn.wait();
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
