// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract Campign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool completed;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    mapping(address => bool) approvals;
    string public campaignTitle;
    string public campaignDescription;
    string public coverImageURL;
    uint256 public targetAmount;

    mapping(uint256 => Request) requests;
    uint256 numRequests;

    uint256 public minContribution;
    address public manager;
    mapping(address => bool) public approvers;
    uint256 private contributors;

    constructor(uint256 _min, address sender) {
        minContribution = _min;
        manager = sender;
    }

    function contribute() public payable {
        require(msg.value >= minContribution);
        approvers[msg.sender] = true;
        contributors++;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        // Request memory newRequest = requests.push();
        Request storage newRequest = requests[numRequests++];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.completed = false;
        // newRequest.approvals = {};
        // Request memory newRequest = Request(description, value, recipient, false, 0);
        // requests.push(newRequest);
    }

    function getSummaryOfContract()
        public
        view
        returns (
            uint256,
            address,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            minContribution,
            manager,
            contributors,
            numRequests,
            address(this).balance
        );
    }

    function getRequestCount() public view returns (uint256) {
        return (numRequests);
    }

    function getRequestAtIndex(uint256 _index)
        public
        view
        returns (
            uint256,
            uint256,
            address,
            string memory,
            bool
        )
    {
        Request storage r = requests[_index];
        return (
            r.value,
            r.approvalCount,
            r.recipient,
            r.description,
            r.completed
        );
    }

    function finalizeRequest(uint256 index) private {
        Request storage request = requests[index];
        require(!request.completed);
        payable(request.recipient).transfer(request.value);
        request.completed = true;
    }

    function approveRequest(uint256 index) public {
        Request storage ind = requests[index];
        require(approvers[msg.sender]);
        require(!ind.approvals[msg.sender]);
        ind.approvals[msg.sender] = true;
        ind.approvalCount++;
        if (ind.approvalCount > (contributors / 2)) {
            finalizeRequest(index);
        }
    }
}
