// const web3 = require("./web3");
const campignFactory = require("./build/CampignFactory.json");
const Web3 = require("web3");
// console.log("\nhere-------\n", web3.net.Contract, "\nhere-------\n");

let instance;
export let web3;
export let accounts;

const init = () => {
  web3 = new Web3(Web3.givenProvider || "ws://localhost:9545");
  ethereum.request({ method: "eth_requestAccounts" }).then((result) => {
    accounts = result;
  });
  instance = new web3.eth.Contract(
    campignFactory.abi,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );
  return [web3, instance, accounts];
};

if (typeof window !== "undefined") {
  init();
  // console.log(web3, instance, accounts);
}

export default instance;
