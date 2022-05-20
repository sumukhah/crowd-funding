import { createContext, useContext, useState, useEffect } from "react";
import setWeb3Instance from "../ethereum/setWeb3Instance";

const { web3, contract } = setWeb3Instance();
console.log(web3, contract, "from state.js");

export const AccountContext = createContext({
  walletAddress: "",
  web3,
  contract,
  setWalletAddress: (address) => {},
});
export const ContractListContext = createContext({});
// AccountContext.displayName = "app-state-container";

export function AppWrapper({ children }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [contractList, setContractList] = useState({});

  useEffect(() => {
    const makeContractRequest = async () => {
      const result = await contract.methods.getCampines().call();

      const campaignsList = {};
      if (!result) {
        return;
      }

      for (let campaignId of result) {
        const campaignDetail = await contract.methods
          .getCampaignDetail(campaignId)
          .call();
        campaignsList[campaignId] = campaignDetail;
      }
      setContractList(campaignsList);
    };
    makeContractRequest();
  }, []);

  return (
    <AccountContext.Provider
      value={{ walletAddress, setWalletAddress, web3, contract }}
    >
      <ContractListContext.Provider value={{ contractList, setContractList }}>
        {children}
      </ContractListContext.Provider>
    </AccountContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AccountContext);
}
