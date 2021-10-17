import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WaveToken.json';

class Waver extends React.Component {
  render() {
    return <div className="status">Top Waver is {this.props.waver} with {this.props.count} waves !</div>;
  }
}

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.input = React.createRef();
  }

  handleClick(e) {
    let message = this.input.current.value;
    this.input.current.value = "";
    console.log("Sending Wave(\"", message, "\")");
    this.props.waveFunction(message);
  }

  render() {
    return (
      <div>
        <div className="form">
          <label for="message">Your message:</label>
          <input type="text" name="message" ref={this.input} />
        </div>
        <button className="waveButton" onClick={this.handleClick}>Wave at Me</button>
      </div>
    );
  }
}

export default function App() {

  const contractAddress = "0xC81c7305610Ab465a041f3f0E093A6212FaA6339"
  const contractABI = abi.abi;

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [wavingStatus, setWavingStatus]     = useState("");
  const [totalWaves, setTotalWaves]         = useState(0);
  const [topWaver, setTopWaver]             = useState({waver: "", count: 0});
  const [allWaves, setAllWaves]             = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      /*
       * First make sure we have access to window.ethereum
       */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        getTotalWaves();
        getTopWaver();
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalWaves = async() => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, provider);

          let count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());
          setTotalWaves(count.toNumber());
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
  }

  const getTopWaver = async() => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, provider);

          let [waver, count] = await wavePortalContract.getTopWaver()
          console.log("Top waver is", waver, "with", count.toNumber(), "waves");
          setTopWaver({waver: waver, count: count.toNumber()});
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, provider);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned.reverse());

        /*
         * React to NewWaves events
         */
        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);

          setAllWaves(prevState => [{
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message
          }, ...prevState]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async (message) => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

          const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });

          const shortTxn =  waveTxn.hash.substring(0,10);

          console.log("Mining...", waveTxn.hash);
          setWavingStatus(`Mining ${shortTxn}...`);

          await waveTxn.wait();

          console.log("Mined -- ", waveTxn.hash);
          setWavingStatus(`Mined ${shortTxn} !`);

          setTimeout(() => { setWavingStatus('') }, 2000);

          getTotalWaves();
          getTopWaver();
          /* getAllWaves(); */

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
  }

  const formatTime = (date) => {
    let options = {
      dateStyle: 'short', timeStyle: 'short'
    };
    return new Intl.DateTimeFormat('default', options).format(date);
  }

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave emoji">👋</span> Hey there!
        </div>

        <div className="bio">
          I am Pierre and I build software for Awesome Companies.<br/>
          Connect your Ethereum wallet and wave at me!
        </div>

        {currentAccount && (
          <div className="body">
            <div>Oh my god ! I collected {totalWaves} waves so far.</div>
            <MessageForm waveFunction={wave} />
            { topWaver.count > 0 && (
            <Waver waver={topWaver.waver} count={topWaver.count} />
            )}
          </div>
        )}

        {wavingStatus && (
          <div className="status">{wavingStatus}</div>
        )}

        {/*
          * If there is no currentAccount render this button
          */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="messages">
              <div className="address">From {wave.address}</div>
              <div className="time">{formatTime(wave.timestamp)}</div>
              <div className="break" />
              <div className="message">{wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
