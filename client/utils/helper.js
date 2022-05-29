import web3 from "web3";

const convertEtherToWei = (ether) => {
  if (!ether) return 0;
  console.log(ether, "here is ether");
  return web3.utils.toWei(ether, "ether");
};

const convertWeiToEither = (wei) => {
  if (!wei) return 0;
  return web3.utils.fromWei(wei, "ether");
};

export { convertEtherToWei, convertWeiToEither };
