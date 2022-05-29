import React, { useEffect, useState, useContext } from "react";
import createContractObject from "../../ethereum/createContractObject";
import {
  Button,
  Card,
  Input,
  Form,
  Typography,
  Drawer,
  message,
  Empty,
  Spin,
} from "antd";
import { DollarCircleFilled, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { ContractListContext, AccountContext } from "../../context/state";
import RequestList from "../../components/RequestList/RequestList";
import { SiEthereum } from "react-icons/si";
import { BiCodeBlock } from "react-icons/bi";
const { Text, Title } = Typography;
import { convertWeiToEither, convertEtherToWei } from "../../utils/helper";
import { PLACEHOLDER_URL } from "../../utils/constants";
import PriceInput from "../../components/PriceInput";

const CampaignShow = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const { contractList } = useContext(ContractListContext);
  const { walletAddress } = useContext(AccountContext);
  const [thisContract, setThisContract] = useState(null);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const currentContract = contractList[campaignId];
  const [requestList, setRequestList] = useState([]);
  const [formInput, setFormInput] = useState({});

  const onChangeInput = (name, value) => {
    setFormInput({ ...formInput, [name]: value });
  };

  // const [isLoading, setIsLoading] = useState(true);

  const handleDrawerVisiblity = () => {
    setShowContributeForm(!showContributeForm);
  };

  const handleApproveRequest = async (campaignIndex) => {
    try {
      await thisContract.methods
        .approveRequest(campaignIndex)
        .send({ from: walletAddress });
      router.reload();
    } catch (e) {
      message.error("Make sure you are a contributor and not approved already");
      console.log(e);
    }
  };

  const onCreateRequestFormSubmit = async ({
    recepient,
    value,
    description,
  }) => {
    try {
      await thisContract.methods
        .createRequest(description, value, recepient)
        .send({ from: walletAddress });
      router.reload();
    } catch (e) {
      console.log(e);
    }
  };

  const [detailedInfo, setDetailedInfo] = useState({
    minContribution: 0,
    contributors: 0,
    balance: 0,
    manager: "",
    requestCount: 0,
  });

  useEffect(() => {
    const getCampaignDetail = async () => {
      if (!campaignId) {
        return;
      }
      const thisContract = createContractObject(campaignId);
      setThisContract(thisContract);
      const result = await thisContract.methods.getSummaryOfContract().call();

      const [minContribution, manager, contributors, requestCount, balance] =
        Object.values(result);
      setDetailedInfo({
        minContribution,
        manager,
        contributors,
        requestCount,
        balance,
      });
      // setIsLoading(false);
    };

    contractList[campaignId] && getCampaignDetail();
  }, [campaignId, contractList]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requestList = [];

      for (let i = 0; i < detailedInfo.requestCount; i++) {
        const result = await thisContract.methods.getRequestAtIndex(i).call();

        requestList.push({
          value: result[0],
          approvalCount: result[1],
          recepient: result[2],
          description: result[3],
          completed: result[4],
        });
      }
      setRequestList(requestList);
    };
    detailedInfo.requestCount > 0 && fetchRequests();
  }, [detailedInfo]);

  if (!currentContract || !contractList[campaignId]) {
    return (
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 200,
        }}
        style={{ height: "100vh" }}
        description={
          <span>You don't have a smart contract in this address</span>
        }
      >
        <Button
          type="primary"
          onClick={() => {
            router.push("/campaign/new");
          }}
        >
          Create Now
        </Button>
      </Empty>
    );
  }

  const onDonateFormSubmit = async () => {
    try {
      await thisContract.methods
        .contribute()
        .send({ from: walletAddress, value: formInput.donationAmount });
      // router.push(`/campaign/${campaignId}`);
      router.reload();
    } catch (e) {
      console.log(e, "from campaign contribution");
    }
  };

  return (
    <div id="campaign-detail-page">
      <div className="campaign-detail-section">
        <Card
          id="contract-detail-image-card"
          cover={<img src={currentContract.imageURL || PLACEHOLDER_URL} />}
          title={
            <div className="card-image-header">
              <Text
                level={5}
                code
                ellipsis
                copyable
                className="contract-detail-campaign-address"
                style={{ maxWidth: "200px" }}
              >
                {campaignId}
              </Text>
              <Text>
                {convertWeiToEither(detailedInfo.balance)} <SiEthereum />
              </Text>
            </div>
          }
        />
      </div>
      <div className="campaign-detail-section">
        <Title level={1}>{currentContract.title}</Title>
        <Card
          className="detial-section-card-container"
          title="Smart contract information"
        >
          <b>
            Created By
            <Text
              code
              ellipsis
              copyable
              // style={{ maxWidth: "200px" }}
              // className="contract-detail-campaign-address campaign-detail-text-item"
              // style={{ maxWidth: "100px" }}
            >
              {detailedInfo.manager}
            </Text>
          </b>
          <div className="campaign-basic-detail">
            <Text className="mini-detail-section">
              <TeamOutlined />
              {detailedInfo.contributors} Investors
            </Text>
            <Text className="mini-detail-section">
              <BiCodeBlock />
              Requested {convertWeiToEither(currentContract.targetAmount)}
            </Text>

            <Text className="mini-detail-section">
              <SiEthereum />
              Min Contribution:
              {convertWeiToEither(detailedInfo.minContribution)}
            </Text>
          </div>
        </Card>
        <Card className="detial-section-card-container">
          <Button
            type="primary"
            onClick={handleDrawerVisiblity}
            icon={<DollarCircleFilled />}
            size="large"
          >
            Make an offer
          </Button>
        </Card>
      </div>

      <Card className="campaign-detail-section" title="Description">
        <Text>{currentContract.description}</Text>
      </Card>

      <RequestList
        className="campaign-detail-section"
        onCreateRequestFormSubmit={onCreateRequestFormSubmit}
        requestList={requestList}
        handleApproveRequest={handleApproveRequest}
        isAdmin={
          detailedInfo.manager.toLowerCase() == walletAddress.toLowerCase()
        }
      />

      <Drawer
        title="Fund this project"
        placement="right"
        onClose={handleDrawerVisiblity}
        visible={showContributeForm}
      >
        <Form onFinish={onDonateFormSubmit}>
          <Form.Item name="amount">
            <PriceInput
              type="number"
              name="donationAmount"
              onChangeInput={onChangeInput}
            />
          </Form.Item>
          <Form.Item>
            <Button type="default" htmlType="submit">
              Donate
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};
export default CampaignShow;
