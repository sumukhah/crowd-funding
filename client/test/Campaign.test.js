const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const compiledCampaignFactory = require("../ethereum/build/CampignFactory.json");
const compiledCampaign = require("../ethereum/build/Campign.json");

const web3 = new Web3(ganache.provider());

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
    .deploy({ data: compiledCampaignFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });
});
