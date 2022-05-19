import React, { useState, useContext } from "react";
import { Form, Input, Button, Card } from "antd";
// import factory, { accounts } from "../../ethereum/factory";
import { AccountContext } from "../../context/state";
import { useRouter } from "next/router";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const NewCampaignForm = () => {
  const { contract, walletAddress } = useContext(AccountContext);
  const router = useRouter();
  // const [minContribution, changeMinContribution] = useState(0);
  const onFinish = async ({
    minContribution,
    title,
    description = "",
    imageURL = "",
    targetAmount,
  }) => {
    try {
      const result = await contract.methods
        .deployContract(
          Number(minContribution),
          title,
          description,
          imageURL,
          Number(targetAmount)
        )
        .send({ from: walletAddress });
      router.push("/");
    } catch (e) {
      console.log(e);
      console.log(e.message);
    }
  };
  // console.log(minContribution);
  return (
    <div id="campaign-create-container">
      <h2>Create a new campaign</h2>
      <div></div>
      <Card className="campaign-create-card">
        <Form
          name="basic"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 8 }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          // autoComplete="off"
          {...formItemLayout}
        >
          <Form.Item
            label="Minimum contribution"
            name="minContribution"
            rules={[
              { required: true, message: "Please input min contribution!" },
            ]}
          >
            <Input addonAfter="wei" type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Raising target"
            name="targetAmount"
            rules={[
              {
                required: true,
                message: "Please target you are expecting to rise!",
              },
            ]}
          >
            <Input addonAfter="wei" type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input Title" }]}
          >
            <Input placeholder="ex: Building a better future with company name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Give a breif about what your company does, aims" />
          </Form.Item>
          <Form.Item label="Cover Image URL" name="imageURL">
            <Input type="url" placeholder="http://image_url.com" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              xs: { span: 44, offset: 10 },
              sm: { span: 16, offset: 10 },
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewCampaignForm;
