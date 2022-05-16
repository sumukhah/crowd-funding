import React, { useEffect, useContext } from "react";
import { Button } from "antd";
import { WalletOutlined } from "@ant-design/icons";
import { AccountContext } from "../context/state";
import { useRouter } from "next/router";

export default function login() {
  const router = useRouter();

  useEffect(() => {
    if (!window.ethereum) {
      alert("Install metamask and try again");
    }
    // if there is wallet address then take back to home
  }, []);
  useEffect(() => {
    if (!!walletAddress) {
      router.push("/");
    }
  }, [walletAddress]);

  return l;
}
