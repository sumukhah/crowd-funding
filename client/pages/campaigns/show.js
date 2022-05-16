import React from "react";
import { accounts, web3 } from "../../ethereum/factory";
import { getCampaigns } from "../../ethereum/campaign";
import { Button, Card, Col, Input, Row, Form } from "antd";

export default class CampaignShow extends React.Component {
  state = {
    campaignId: "",
    minContribution: 0,
    manager: "",
    contributors: 0,
    requests: 0,
    balance: 0,
    amount: 0,
  };
  componentDidMount = async () => {
    const result = await getCampaigns(this.props.address)
      .methods.getSummaryOfContract()
      .call();
    // console.log(result.values(), typeof result);
    const [minContribution, manager, contributors, requests, balance] =
      Object.values(result);
    this.setState({
      campaignId: this.props.address,
      minContribution,
      manager,
      contributors,
      requests,
      balance,
    });
    // console.log(minContribution, manager, contributors, requests, balance);
  };
  static async getInitialProps({ query }) {
    return { address: query.slug };
  }

  handleOnDonate = async (data) => {
    console.log(data.amount);

    const result = await getCampaigns(this.state.campaignId)
      .methods.contribute()
      .send({
        from: accounts[0],
        value: web3.utils.toWei(data.amount, "ether"),
      });
  };
  render() {
    const {
      campaignId,
      minContribution,
      manager,
      contributors,
      requests,
      balance,
    } = this.state;

    return (
      <div>
        <div style={{ margin: 40 }}>
          <h2>Campaign Details</h2>
          <b>campaign id:{campaignId}</b>
          <p>created by: {manager}</p>
          <Row gutter={5}>
            <Col span={5}>
              <Card title="Minimum Amount">{minContribution}</Card>
            </Col>
            <Col span={5}>
              <Card title="Total Contributors">{contributors}</Card>
            </Col>
            <Col span={5}>
              <Card title="Total Balance">{balance}</Card>
            </Col>
            <Col span={5}>
              <Card title="Total Requests">{requests}</Card>
            </Col>
          </Row>
          <div
            gutter={2}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Col
              span={5}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.handleOnDonate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 50,
                }}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="amount"
                  name="amount"
                  rules={[
                    { required: true, message: "Please input your amount!" },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Donate
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </div>
        </div>
      </div>
    );
  }
}
