# WaveToken

Contract lives in `contracts\WaveToken.sol`

## Instructions

* Install dependencies using `yarn install`
* Run and test locally using `npx hardhat run scripts\run.js`
* Start a local blockchain node in another terminal `npx hardhat node`
* Deploy to the local node `npx hardhat run scripts\deploy.js --network localhost`

## Deploy to Rinkeby

* Create an account and a project on `https://www.alchemy.com`
* Grab the project url : `https://eth-rinkeby.alchemyapi.io/v2/<your api key>` and store it into `.env`

```
STAGING_ALCHEMY_URL=<your alchemy project url>
```

* Install Metamask, switch to `Rinkeby` testnet
* Grab some faucet ETH
* Extract your account private key and store it into the `.env` file

```
STAGING_ALCHEMY_URL=<your alchemy project url>
PRIVATE_KEY=<your private key>
```

* Deploy the contract to the Rinkeby testnet `npx hardhat run scripts/deploy.js --network rinkeby`

# IMPORTANT ! Copy the contract address

* Paste the contract address into `frontend/App.js` at around line 41 `const contractAddress = "<contract address>"`
* Copy the contract ABI : `cp artifacts/contracts/WaveToken.sol/WaveToken.json frontend/src/utils`

## Compile the frontend

* `cd` into the `frontend` folder
* `yarn install`
* `yarn build`
* Install `surge.sh` with `npm install -g surge`
* `cd build`
* `mv index.html 200.html`
* `surge`
