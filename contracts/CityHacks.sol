// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CityHacks is Ownable {
    uint256 totalHacks;

    uint256 private latestReportBlock;
    uint256 private reportedHacksCount;

    event TrustReport(address indexed from, uint256 indexed id, bool _inadecuate, uint256 indexed latestReportBlock, uint256 timestamp, uint256[] reportedHacks);

    event NewHack(address indexed from, uint256 indexed id, string description, uint256 timestamp);
    event VotedHack(address indexed from, uint256 indexed hackId, bool _positive, uint256 timestamp);

    struct Hack {
        address owner;
        uint256 id;
        uint256 cityId;
        uint256 categoryId;
        string description;
        uint256 timestamp;
        bool isVotingBlocked;
        uint256 totalUpvotes;
        uint256 totalDownvotes;
        bool hidden;
    }

    struct AddressVote {
        bool voted;
        bool voteResult;
    }

    Hack[] hacks;
    mapping(address => mapping(uint256 => AddressVote)) votes;
    mapping(uint256 => uint256[]) voteTimestamps;

    constructor() {}

    function getLatestReportBlock() public view onlyOwner returns (uint256) {
        return latestReportBlock;
    }

    function reportHack(uint256 _hackId, uint256[] memory _reportedHacks) public {
        require(reportedHacksCount + 1 == _reportedHacks.length);
        latestReportBlock = block.number;
        reportedHacksCount += 1;
        emit TrustReport(msg.sender, _hackId, true, latestReportBlock, block.timestamp, _reportedHacks);
    }

    function unreportHack(uint256 _hackId, uint256[] memory _reportedHacks) public onlyOwner {
        require(reportedHacksCount - 1 == _reportedHacks.length && reportedHacksCount - 1 >= 0);
        latestReportBlock = block.number;
        reportedHacksCount -= 1;
        emit TrustReport(msg.sender, _hackId, false, latestReportBlock, block.timestamp, _reportedHacks);
    }

    function hideAndUnreportHack(uint256 _hackId, uint256[] memory _reportedHacks) public onlyOwner {
        unreportHack(_hackId, _reportedHacks);
        hideHack(_hackId);
    }

    function hideHack(uint256 _hackId) public onlyOwner {
        hacks[_hackId].hidden = true;
    }

    function postHack(string memory _description, uint256 _cityId, uint256 _categoryId) public {
        bytes memory stringBytes = bytes(_description);
        require(stringBytes.length > 0 && _cityId > 0 && _categoryId > 0);
        hacks.push(Hack(msg.sender, totalHacks, _cityId, _categoryId, _description, block.timestamp, false, 0, 0, false));
        totalHacks += 1;
        emit NewHack(msg.sender, totalHacks, _description, block.timestamp);
    }

    function voteHack(uint256 _hackId, bool _positive) public {
        require(msg.sender != hacks[_hackId].owner);
        AddressVote memory addressVote = votes[msg.sender][_hackId];
        if (addressVote.voted) {
            require(addressVote.voteResult != _positive);
            if (addressVote.voteResult) {
                hacks[_hackId].totalUpvotes -= 1;
                hacks[_hackId].totalDownvotes += 1;
            } else {
                hacks[_hackId].totalUpvotes += 1;
                hacks[_hackId].totalDownvotes -= 1;
            }
        } else {
            if (_positive) {
                hacks[_hackId].totalUpvotes += 1;
            }
            else {
                hacks[_hackId].totalDownvotes += 1;
            }
            addressVote.voted = true;
        }
        addressVote.voteResult = _positive;
        votes[msg.sender][_hackId] = addressVote;
        voteTimestamps[_hackId].push(block.timestamp);
        emit VotedHack(msg.sender, _hackId, _positive, block.timestamp);
    }

    function tipHacker(uint256 _hackId) payable public {
        (bool sent,) = hacks[_hackId].owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function getAllHacks() public view returns(Hack[] memory) {
        return hacks;
    }

    function getTotalHacks() public view returns (uint256) {
        return totalHacks;
    }
}
