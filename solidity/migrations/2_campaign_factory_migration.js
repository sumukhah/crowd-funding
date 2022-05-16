const CampaignFactory = artifacts.require("CampignFactory");

module.exports = function (deployer) {
  deployer.deploy(CampaignFactory);
};
