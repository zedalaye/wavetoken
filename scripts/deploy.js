const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log('Deploying contracts with account:', deployer.address);
    console.log('Account balance:', hre.ethers.utils.formatEther(accountBalance));

    const Token = await hre.ethers.getContractFactory('WaveToken');
    const portal = await Token.deploy({
      value: hre.ethers.utils.parseEther('0.001'),
    });
    await portal.deployed();

    console.log('WaveToken address:', portal.address);
  };

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

  runMain();