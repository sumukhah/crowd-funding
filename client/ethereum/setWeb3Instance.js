const campignFactory = require("./build/CampignFactory.json");
const Web3 = require("web3");

const setWeb3Instance = () => {
  const web3 = new Web3(
    Web3.givenProvider || "ws://localhost:9545" || "ws://localhost:8545"
  );
  const contract = new web3.eth.Contract(
    campignFactory.abi,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );
  // console.log("web3, contract", contract, web3);
  return { web3, contract };
};

export default setWeb3Instance;
