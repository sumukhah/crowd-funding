const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

const campaignSource = fs.readFileSync(campaignPath, "utf8");

// const input = {
//   language: "Solidity",
//   sources: {
//     "Campaign.sol": {
//       content: campaignSource,
//     } /*
//       'AnotherFileWithAnContractToCompile.sol': {
//           content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'AnotherFileWithAnContractToCompile.sol'), 'utf8')
//       }*/,
//   },
//   settings: {
//     outputSelection: {
//       // return everything
//       "*": {
//         "*": ["*"],
//       },
//     },
//   },
// };
// const output = JSON.parse(solc.compile(JSON.stringify(input)));

const output = solc.compile(campaignSource, 1).contracts;
for (contract in output) {
  fs.outputJSONSync(
    path.resolve(__dirname, "build", contract.slice(1) + ".json"),
    output[contract]
  );
}
console.log("-------output------ \n", output);
fs.ensureDirSync(buildPath);
