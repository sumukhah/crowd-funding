import { web3 } from "./factory";
import Campaign from "../ethereum/build/Campign.json";

const getCampaigns = (address) => {
  const instance = new web3.eth.Contract(
    Campaign.abi,
    address
  );
  return instance;
};

export { getCampaigns };
