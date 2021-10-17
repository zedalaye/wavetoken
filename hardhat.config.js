require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [ process.env.PRIVATE_KEY ]
    }
  }
};

// WaveToken Contract Addresses : https://rinkeby.etherscan.io/address/
// v1: 0xAA6598722cFb918eA421f886c21EE2F7ad6C6b34 (record wavers / top waver)
// v2: 0x767677A492BC0236e6b1E429373Fc4EFE9F81feC (list waves)
// v3: 0x1a3B11d225D30ea037C9fEf1d2741FFb6Cd5ec83 (send ETH back to waver)
// v4: 0xa86fE2921D28220e2C7CD8a8a87011c1654209C7 (random pick winners and cooldown wavers to one wave per 15 minutes)
// v5: 0xC81c7305610Ab465a041f3f0E093A6212FaA6339 (cooldown delay decreased to 30s)