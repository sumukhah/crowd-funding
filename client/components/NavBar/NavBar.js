import React, { useEffect } from "react";
import { Card, Input, Button, Drawer, message, Typography } from "antd";

import {
  SearchOutlined,
  WalletFilled,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AccountContext } from "../../context/state";
import { Router, useRouter } from "next/router";

const { Text, Title } = Typography;

export default function NavBar() {
  const { walletAddress, setWalletAddress, web3 } =
    React.useContext(AccountContext);
  const router = useRouter();

  const [drawerVisiblity, setDrawerVisiblity] = React.useState(false);
  const [balance, setWalletBalance] = React.useState(0);

  useEffect(() => {
    const address = localStorage.getItem("walletAddress");
    if (address) {
      connectUserWalletHandler();
    }
  }, []);

  React.useEffect(() => {
    const getBalance = async () => {
      let walletBalance = await web3.eth.getBalance(walletAddress);
      walletBalance = web3.utils.fromWei(walletBalance, "ether");
      setWalletBalance(walletBalance);
    };
    walletAddress && getBalance();
  }, [walletAddress]);

  const disconnectUserWalletHandler = async () => {
    try {
      setWalletAddress("");
      localStorage.removeItem("walletAddress");
    } catch (e) {}
  };

  const connectUserWalletHandler = async () => {
    try {
      if (!window || !window.ethereum) {
        message.error("Install meta mask wallet and try again");
        return;
      }
      const addresses = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(addresses[0]);
      localStorage.setItem("walletAddress", addresses[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDrawerVisiblity = () => {
    setDrawerVisiblity(!drawerVisiblity);
  };

  return (
    <div id="navbar-container">
      <Button
        type="text"
        onClick={() => {
          router.push("/");
        }}
      >
        <Title level={3}>Crowd funding</Title>
      </Button>
      <Input
        addonBefore={<SearchOutlined />}
        className="nav-search-input"
        placeholder="input search text"
        allowClear
        style={{ width: "90%" }}
      />
      <div className="nav-options">
        <div>
          <Button
            type="text"
            size="large"
            onClick={() => {
              router.push("/campaign/new");
            }}
          >
            Create
          </Button>
          <Button
            type="text"
            onClick={setDrawerVisiblity}
            icon={<WalletFilled />}
            size="large"
          >
            My Wallet
          </Button>
        </div>
      </div>

      <Drawer
        title="Your Wallet"
        placement="right"
        onClose={handleDrawerVisiblity}
        visible={drawerVisiblity}
      >
        <>
          {!walletAddress ? (
            <Button
              type="default"
              icon={<WalletOutlined />}
              onClick={connectUserWalletHandler}
            >
              Connect your wallet
            </Button>
          ) : (
            <div className="wallet-info-container">
              <Card size="small" className="wallet-info-cards">
                <Title level={5}>You have connected to</Title>
                <Text code copyable strong ellipsis>
                  {walletAddress}
                </Text>
              </Card>

              <Card size="small" className="wallet-info-cards">
                <Title level={5}>Total balance</Title>
                <Text strong code>
                  {Math.trunc(Number(balance) * 1000) / 1000} ether
                </Text>
              </Card>

              <Button
                icon={<LogoutOutlined />}
                onClick={disconnectUserWalletHandler}
                type="default"
                danger
                style={{
                  marginTop: "auto",
                  marginBottom: "20px",
                  alignSelf: "center",
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </>
      </Drawer>
    </div>
  );
}
