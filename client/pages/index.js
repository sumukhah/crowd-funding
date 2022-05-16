import React from "react";
import { AccountContext } from "../context/state";
import { Card, Button, Typography } from "antd";
import { ArrowsAltOutlined, PlusOutlined } from "@ant-design/icons";
import { withRouter } from "next/router";
import { Link } from "../routes";
import { PLACEHOLDER_URL } from "../utils/constants";

const { Text, Title } = Typography;

class Home extends React.Component {
  state = {
    campains: [],
    campaignsList: {},
  };
  componentDidMount = async () => {
    const { walletAddress } = this.context;
    // if (!walletAddress) {
    //   Router.push("/login");
    // }
    const { contract } = this.context;
    const result = await contract.methods.getCampines().call();
    this.setState({
      campains: [
        ...result,
        // ...result,
        // ...result,
        // ...result,
        // ...result,
        // ...result,
        // ...result,
      ],
    });
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
    this.setState({ campaignsList });
  };
  render() {
    const { campaignsList } = this.state;
    console.log(campaignsList);
    return (
      <div id="campaign-container">
        {this.state.campains.map((campain) => (
          <Card
            type="inner"
            size="default"
            bordered
            key={campain}
            className="campaign-card"
            cover={
              <img
                alt="image"
                src={campaignsList[campain]?.imageURL || PLACEHOLDER_URL}
              />
            }
          >
            <Title level={5}>
              {campaignsList[campain]?.title?.slice(0, 50)}
            </Title>
            <Text>{campaignsList[campain]?.description?.slice(0, 100)}...</Text>
            <Text code copyable strong ellipsis>
              {campain}
            </Text>
            <div className="campaign-card-footer">
              <Text>Target: {campaignsList[campain]?.targetAmount}</Text>
              <Link route={`campaigns/${campain}/`} params={{ id: campain }}>
                <a>
                  <Button type="link" icon={<ArrowsAltOutlined />}>
                    View campaign
                  </Button>
                </a>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  }
}
Home.contextType = AccountContext;

export default withRouter(Home);
