import React, { useContext, useState } from "react";
import { ContractListContext } from "../context/state";
import { Card, Typography } from "antd";
import { PLACEHOLDER_URL } from "../utils/constants";
import { useRouter } from "next/router";

const { Text, Title } = Typography;

const Home = () => {
  const { contractList } = useContext(ContractListContext);
  const router = useRouter();

  return (
    <div id="campaign-container">
      {Object.keys(contractList).map((campain) => (
        <Card
          hoverable
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
          onClick={() => {
            router.push({
              pathname: "/campaign/[campaignId]",
              query: { campaignId: campain },
            });
          }}
        >
          <div>
            <Title level={5}>
              {contractList[campain]?.title?.slice(0, 50)}
            </Title>
          </div>
          <Text>{contractList[campain]?.description?.slice(0, 100)}...</Text>
          <Text code copyable strong ellipsis style={{ maxWidth: "200px" }}>
            {campain}
          </Text>
        </Card>
      ))}
    </div>
  );
};

export default Home;
