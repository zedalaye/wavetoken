const main = async () => {
    // Get Accounts.
    const [owner, randomPerson] = await hre.ethers.getSigners();

    // Get contract factory and deploy a contract instance.
    const waveTokenFactory = await hre.ethers.getContractFactory('WaveToken');
    const waveContract = await waveTokenFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    // Check contract balance
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    const cooldown = 31; // seconds;

    // Make owner wave()
    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn;
    waveTxn = await waveContract.wave("Message 1");
    await waveTxn.wait();

    // Advance next block timestamp
    await hre.ethers.provider.send("evm_increaseTime", [cooldown]);

    waveTxn = await waveContract.wave("Message 2");
    await waveTxn.wait();

    // Wave() using another account
    let otherWaver = waveContract.connect(randomPerson);
    waveTxn = await otherWaver.wave("Message 3");
    await waveTxn.wait();

    // Advance next block timestamp
    await hre.ethers.provider.send("evm_increaseTime", [cooldown]);

    waveTxn = await otherWaver.wave("Message 4");
    await waveTxn.wait();

    // Advance next block timestamp
    await hre.ethers.provider.send("evm_increaseTime", [cooldown]);

    waveTxn = await otherWaver.wave("Message 5");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
    let topWaver = await waveContract.getTopWaver();
    console.log(topWaver);

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

    // Check contract balance to see what's happened
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));
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