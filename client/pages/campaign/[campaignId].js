import React, { useEffect, useState, useContext } from "react";
import createContractObject from "../../ethereum/createContractObject";
import { Button, Card, Col, Input, Row, Form, Typography, Drawer } from "antd";
import {
  DollarCircleFilled,
  TeamOutlined,
  PoundCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { ContractListContext, AccountContext } from "../../context/state";

const { Text, Title } = Typography;

const CampaignShow = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const { contractList } = useContext(ContractListContext);
  const { walletAddress } = useContext(AccountContext);
  const currentContract = contractList[campaignId];
  const [showContributeForm, setShowContributeForm] = useState(false);

  const handleDrawerVisiblity = () => {
    setShowContributeForm(!showContributeForm);
  };

  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
  });
  const [detailedInfo, setDetailedInfo] = useState({
    minContribution: 0,
    contributors: 0,
    balance: 0,
    manager: "",
    request: 0,
  });
  const [thisContract, setThisContract] = useState(null);

  useEffect(() => {
    const getCampaignDetail = async () => {
      if (!campaignId) {
        return;
      }
      const thisContract = createContractObject(campaignId);
      setThisContract(thisContract);
      const result = await thisContract.methods.getSummaryOfContract().call();
      console.log(result);

      const [minContribution, manager, contributors, requests, balance] =
        Object.values(result);
      setDetailedInfo({
        minContribution,
        manager,
        contributors,
        requests,
        balance,
      });
    };
    getCampaignDetail();
  }, [campaignId]);

  if (!currentContract) {
    return null;
  }

  const onDonateFormSubmit = async ({ amount }) => {
    try {
      console.log(amount);
      await thisContract.methods
        .contribute()
        .send({ from: walletAddress, value: amount });
      router.push("/");
    } catch (e) {
      console.log(e, "from campaign contribution");
    }
  };
  console.log(detailedInfo);

  return (
    <div id="campaign-detail-page">
      <div className="campaign-detail-section">
        <Card
          id="contract-detail-image-card"
          cover={<img src={currentContract.imageURL} />}
        >
          <Text
            level={5}
            code
            ellipsis
            copyable
            className="contract-detail-campaign-address"
          >
            {campaignId}
          </Text>
        </Card>
      </div>
      <div className="campaign-detail-section">
        <Title level={2}>{currentContract.title}</Title>
        <Card className="detial-section-card-container">
          <Text>
            Created By:
            <Text
              code
              ellipsis
              copyable
              className="contract-detail-campaign-address campaign-detail-text-item"
            >
              {detailedInfo.manager}
            </Text>
          </Text>
          <div className="campaign-basic-detail">
            <Text className="mini-detail-section">
              <TeamOutlined />
              {detailedInfo.contributors} Investors
            </Text>
            <Text className="mini-detail-section">
              <FileTextOutlined />
              Requested {currentContract.targetAmount} ethers
            </Text>

            <Text className="mini-detail-section">
              <PoundCircleOutlined />
              Total balance: {detailedInfo.balance}
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
      {currentContract.description && (
        <Card className="campaign-detail-section">
          <Text>{currentContract.description}</Text>
        </Card>
      )}
      <Drawer
        title="Your Wallet"
        placement="right"
        onClose={handleDrawerVisiblity}
        visible={showContributeForm}
      >
        <Form onFinish={onDonateFormSubmit}>
          <Form.Item name="amount">
            <Input type="number" />
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

// export default class CampaignShow extends React.Component {
//   state = {

//   };
//   componentDidMount = async () => {
//
//     // console.log(minContribution, manager, contributors, requests, balance);
//   };
//   static async getInitialProps({ query }) {
//     return { address: query.slug };
//   }

//   handleOnDonate = async (data) => {
//     console.log(data.amount);

//     const result = await getCampaigns(this.state.campaignId)
//       .methods.contribute()
//       .send({
//         from: accounts[0],
//         value: web3.utils.toWei(data.amount, "ether"),
//       });
//   };
//   render() {
//     const {
//       campaignId,
//       minContribution,
//       manager,
//       contributors,
//       requests,
//       balance,
//     } = this.state;

//     return (
//       <div>
//         <div style={{ margin: 40 }}>
//           <h2>Campaign Details</h2>
//           <b>campaign id:{campaignId}</b>
//           <p>created by: {manager}</p>
//           <Row gutter={5}>
//             <Col span={5}>
//               <Card title="Minimum Amount">{minContribution}</Card>
//             </Col>
//             <Col span={5}>
//               <Card title="Total Contributors">{contributors}</Card>
//             </Col>
//             <Col span={5}>
//               <Card title="Total Balance">{balance}</Card>
//             </Col>
//             <Col span={5}>
//               <Card title="Total Requests">{requests}</Card>
//             </Col>
//           </Row>
//           <div
//             gutter={2}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               flexDirection: "column",
//             }}
//           >
//             <Col
//               span={5}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 flexDirection: "column",
//               }}
//             >
//               <Form
//                 name="basic"
//                 labelCol={{ span: 8 }}
//                 wrapperCol={{ span: 16 }}
//                 initialValues={{ remember: true }}
//                 onFinish={this.handleOnDonate}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: 50,
//                 }}
//                 // onFinishFailed={onFinishFailed}
//                 autoComplete="off"
//               >
//                 <Form.Item
//                   label="amount"
//                   name="amount"
//                   rules={[
//                     { required: true, message: "Please input your amount!" },
//                   ]}
//                 >
//                   <Input type="number" />
//                 </Form.Item>
//                 <Form.Item>
//                   <Button type="primary" htmlType="submit">
//                     Donate
//                   </Button>
//                 </Form.Item>
//               </Form>
//             </Col>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
