// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WaveToken {
    uint constant cooldownDelay = 30 seconds;
    string constant cooldownMessage = "Please wait 30 seconds before waving again";

    uint totalWaves;
    uint private _totalWavers;
    mapping (uint => address) private wavers;
    mapping (address => uint) private counts;
    mapping (address => uint) private lastWavedAt; // Address => Blockchain Timestamp

    /*
     * to make guessing next random number a bit harder
     */
    uint private seed;

    /*
     * A little magic, Google what events are in Solidity!
     */
    event NewWave(address indexed from, uint timestamp, string message);

    struct Wave {
        address waver;  // The address of the user who waved.
        string message; // The message the user sent.
        uint timestamp; // The timestamp when the user waved.
    }

    Wave[] waves;

    constructor() payable {
        console.log("Be smart. Write Contracts.");
        _totalWavers = 0;
    }

    function wave(string memory _message) public {
        /* Throttling : cooldown wavers */
        require(lastWavedAt[msg.sender] + cooldownDelay < block.timestamp, cooldownMessage);
        lastWavedAt[msg.sender] = block.timestamp;

        if (counts[msg.sender] == 0) {
            console.log("Register %s who has waved for the first time", msg.sender);
            wavers[_totalWavers] = msg.sender;
            _totalWavers += 1;
        }

        counts[msg.sender] += 1;
        totalWaves += 1;
        console.log("We got one more wave from %s! s.he waved %s times on %s total waves", msg.sender, counts[msg.sender], totalWaves);

        // Store the wave
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Compute a technically hard to guess random number
        uint randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %s", randomNumber);

        seed = randomNumber;

        // Sender has ~50% chances to get that reward
        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        // Publish a NewWave{} event
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getWaves() public view returns (uint) {
        uint w = counts[msg.sender];
        console.log("%s has waved %s times", msg.sender, w);
        return w;
    }

    function getTopWaver() public view returns (address, uint) {
        address topWaver;
        uint topWaves = 0;
        for (uint i = 0; i < _totalWavers; i++) {
            address a = wavers[i];
            uint w = counts[a];
            if (w > topWaves) {
                topWaves = w;
                topWaver = a;
            }
        }
        console.log("%s is the top waver with %s waves", topWaver, topWaves);
        return (topWaver, topWaves);
    }
}