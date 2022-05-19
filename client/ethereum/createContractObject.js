import { web3 } from "./factory";
import Campaign from "./build/Campign.json";

const createContractObject = (address) => {
  const instance = new web3.eth.Contract(Campaign.abi, address);
  return instance;
};

export default createContractObject;
