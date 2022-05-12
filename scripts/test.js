const main = async () => {
	const [owner, superCoder] = await hre.ethers.getSigners();
	const domainContractFactory = await hre.ethers.getContractFactory("Domains");
	const domainContract = await domainContractFactory.deploy("x");
	await domainContract.deployed();

	console.log("Contract deployed to:", domainContract.address);

	console.log("Contract owner:", owner.address);

	const address = await domainContract.getAddress("x");

	try {
		let txn = await domainContract.register("x", {value: hre.ethers.utils.parseEther("1234")});
		await txn.wait();
	} catch (error) {
		console.log("Domain name was too short: ", error);
	}
	try {
		let txn = await domainContract.register("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", {
			value: hre.ethers.utils.parseEther("1234"),
		});
		await txn.wait();
	} catch (error) {
		console.log("Domain name was too long: ", error);
	}

	// Let's be extra generous with our payment (we're paying more than required)
	let txn = await domainContract.register("a16z", {value: hre.ethers.utils.parseEther("1234")});
	await txn.wait();

	try {
		let txn = await domainContract.register("a16z", {value: hre.ethers.utils.parseEther("1234")});
		await txn.wait();
	} catch (error) {
		console.log("Could not register a16z twice: ", error);
	}

	// How much money is in here?
	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

	// Quick! Grab the funds from the contract! (as superCoder)
	try {
		txn = await domainContract.connect(superCoder).withdraw();
		await txn.wait();
	} catch (error) {
		console.log("Could not rob contract", error);
	}

	/**
	 * Try to set unauthorized record
	 */
	try {
		txn = await domainContract.connect(superCoder).setRecord("x", "https://twitter.com/wrecsx");
		await txn.wait();
	} catch (error) {
		console.log("Could not set record sly coder", error);
	}
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
