import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  Form,
  InputNumber,
  Empty,
  Typography,
  Collapse,
  Card,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  CheckOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";

const { Text } = Typography;
const { Panel } = Collapse;

export default function RequestList({
  requestList,
  onCreateRequestFormSubmit,
  handleApproveRequest,
  isAdmin,
}) {
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [createNewRequestForm] = Form.useForm();

  const triggerModalState = () => {
    setShowCreateRequestModal(!showCreateRequestModal);
  };

  const onFormSubmit = (args) => {
    onCreateRequestFormSubmit(args);
    triggerModalState();
  };

  return (
    <Card id="campaign-request-list-container" title="Requests">
      <div className="campaign-request-list">
        {requestList.length ? (
          requestList.map((request, ind) => {
            return (
              <Collapse accordion key={request.recepient + ind}>
                <Panel
                  header={`Requesting ${request.value} wei to pay`}
                  id={ind}
                  extra={
                    <div>
                      <Text
                        code
                        ellipsis
                        copyable
                        style={{ maxWidth: "100px" }}
                      >
                        {request.recepient}
                      </Text>
                      {request.completed && (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      )}
                    </div>
                  }
                >
                  <Text>{request.description}</Text>
                  <div className="request-description-footer">
                    <Text strong>
                      <UserOutlined />
                      {request.approvalCount} approvers
                    </Text>
                    <Button
                      onClick={() => {
                        handleApproveRequest(ind);
                      }}
                      icon={<CheckOutlined />}
                      type="primary"
                      hidden={request.completed}
                    >
                      Approve
                    </Button>
                  </div>

                  {/* <div>
                    <b>{`Request ${ind}`}</b>
                    
                    <b>{request.value}</b>
                  </div>
                  <div>
                    <Text>{request.description}</Text>
                  </div> */}
                </Panel>
              </Collapse>
            );
          })
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{
              height: 60,
            }}
          />
        )}
      </div>
      {isAdmin && (
        <div className="create-request-list">
          <Button
            type="dashed"
            onClick={triggerModalState}
            block
            icon={<PlusOutlined />}
          >
            Add Request
          </Button>
        </div>
      )}

      <Modal
        title="Basic Drawer"
        visible={showCreateRequestModal}
        onOk={createNewRequestForm.submit}
        onCancel={triggerModalState}
      >
        <Form
          layout="vertical"
          name="userForm"
          form={createNewRequestForm}
          onFinish={onFormSubmit}
        >
          <Form.Item
            name="recepient"
            label="Recepient Wallet Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="value" label="Amount" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
