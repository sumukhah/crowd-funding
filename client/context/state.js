import { createContext, useContext, useState } from "react";
import setWeb3Instance from "../ethereum/setWeb3Instance";

const { web3, contract } = setWeb3Instance();
console.log(web3, contract, "from state.js");

export const AccountContext = createContext({
  walletAddress: "",
  web3,
  contract,
  setWalletAddress: (address) => {},
});
// AccountContext.displayName = "app-state-container";

export function AppWrapper({ children }) {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <AccountContext.Provider
      value={{ walletAddress, setWalletAddress, web3, contract }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AccountContext);
}