import React, { useEffect, useContext, useState } from "react";
import { AccountContext, ContractListContext } from "../context/state";
import { Card, Button, Typography } from "antd";
import { ArrowsAltOutlined, PlusOutlined } from "@ant-design/icons";
import { PLACEHOLDER_URL } from "../utils/constants";
import { useRouter } from "next/router";

const { Text, Title } = Typography;

const Home = () => {
  const { contract } = useContext(AccountContext);
  const { contractList, setContractList } = useContext(ContractListContext);
  const [campains, setCampains] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const makeContractRequest = async () => {
      const result = await contract.methods.getCampines().call();
      setCampains(result);
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
    <div id="campaign-container">
      {campains.map((campain) => (
        <Card
          type="inner"
          size="default"
          bordered
          key={campain}
          className="campaign-card"
          cover={
            <img
              alt="image"
              src={contractList[campain]?.imageURL || PLACEHOLDER_URL}
            />
          }
        >
          <Title level={5}>{contractList[campain]?.title?.slice(0, 50)}</Title>
          <Text>{contractList[campain]?.description?.slice(0, 100)}...</Text>
          <Text code copyable strong ellipsis>
            {campain}
          </Text>
          <div className="campaign-card-footer">
            <Text>Target: {contractList[campain]?.targetAmount}</Text>

            <Button
              type="link"
              icon={<ArrowsAltOutlined />}
              onClick={() => {
                router.push({
                  pathname: "/campaign/[campaignId]",
                  query: { campaignId: campain },
                });
              }}
            >
              View campaign
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Home;
