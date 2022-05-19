// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;
import "./Campaign.sol";

contract CampignFactory {
    struct NewCampaign {
        string title;
        string description;
        string imageURL;
        uint256 targetAmount;
    }
    address[] public campains;
    mapping(address => NewCampaign) public campaignDetail;

    function getCampaignDetail(address campaignAddress)
        public
        view
        returns (NewCampaign memory)
    {
        return campaignDetail[campaignAddress];
    }

    function getCampines() public view returns (address[] memory) {
        return campains;
    }

    function deployContract(
        uint256 minAmount,
        string memory _title,
        string memory _desc,
        string memory _coverImage,
        uint256 _targetAmount
    ) public payable {
        address deployedCampaign = address(new Campign(minAmount, msg.sender));

        NewCampaign memory newCampaign;
        newCampaign.title = _title;
        newCampaign.description = _desc;
        newCampaign.imageURL = _coverImage;
        newCampaign.targetAmount = _targetAmount;

        campaignDetail[deployedCampaign] = newCampaign;
        campains.push(deployedCampaign);
    }
}
