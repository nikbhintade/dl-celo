// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IRegistry {
    function setAddressFor(string calldata, address) external;

    function getAddressForOrDie(bytes32) external view returns (address);

    function getAddressFor(bytes32) external view returns (address);

    function getAddressForStringOrDie(
        string calldata identifier
    ) external view returns (address);

    function getAddressForString(
        string calldata identifier
    ) external view returns (address);

    function isOneOf(bytes32[] calldata, address) external view returns (bool);
}

interface IRandom {
    function revealAndCommit(bytes32, bytes32, address) external;

    function randomnessBlockRetentionWindow() external view returns (uint256);

    function random() external view returns (bytes32);

    function getBlockRandomness(uint256) external view returns (bytes32);
}

contract Lottery {
    address owner;
    uint256 public endTime;
    uint256 public playerCount;

    struct player {
        address player;
        bool entered;
    }

    mapping(uint => player) players;

    event enteredLottery(address player);
    event announceWinner(address winner);

    // All the functions in the contract should be placed below this line.

    constructor() {
        endTime = block.timestamp + 30 minutes;
        owner = msg.sender;
    }

    function getRandom() internal view returns (bytes32 randomness) {
        randomness = IRandom(
            IRegistry(0x000000000000000000000000000000000000ce10).getAddressFor(
                keccak256(abi.encodePacked("Random"))
            )
        ).random();
    }

    function purchaseTicket() public payable {
        require(block.timestamp <= endTime, "Lottery has ended");
        require(msg.value == 1 ether, "Incorrect ticket price");
        require(msg.sender != owner, "Owner can not enter lottery");

        players[playerCount] = player(msg.sender, true);

        emit enteredLottery(msg.sender);

        playerCount++;
    }

    function selectWinner() public payable {
        require(block.timestamp > endTime, "Lottery has not ended");
        require(msg.sender == owner, "Only the owner can select the winner");

        uint256 winnerIndex = uint256(getRandom()) % playerCount;
        address winner = players[winnerIndex].player;

        emit announceWinner(winner);

        payable(winner).transfer(address(this).balance);
    }
}
