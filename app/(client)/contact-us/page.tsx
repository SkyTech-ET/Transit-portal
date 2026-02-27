"use client";

import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  message,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ContactUsPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      console.log("Message Data:", values);

      // 👉 later connect API here
      // await sendContactMessage(values);

      message.success("Message sent successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to send message.");
    }
  };

  return (
    <div className="px-6 py-8">
      {/* PAGE TITLE */}
      <Title level={2} style={{ color: "#2563eb" }}>
        Contact Us
      </Title>

      {/* CONTACT CARDS */}
      <Row gutter={[24, 24]} className="mt-6">
        <Col xs={24} md={8}>
          <Card className="text-center rounded-xl shadow-sm">
            <MailOutlined style={{ fontSize: 30, color: "#4f46e5" }} />
            <Title level={4} className="mt-3">
              Email Us
            </Title>
            <Text type="secondary">
              Send us an email for general inquiries or documentation requests.
            </Text>
            <br />
            <Text strong style={{ color: "#4f46e5" }}>
              Mohammed.transit@gmail.com
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="text-center rounded-xl shadow-sm">
            <PhoneOutlined style={{ fontSize: 30, color: "#4f46e5" }} />
            <Title level={4} className="mt-3">
              Call Us
            </Title>
            <Text type="secondary">
              Connect by phone for assistance or urgent matters during office
              hours.
            </Text>
            <br />
            <Text strong style={{ color: "#4f46e5" }}>
              +251 0000-0000
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="text-center rounded-xl shadow-sm">
            <EnvironmentOutlined
              style={{ fontSize: 30, color: "#4f46e5" }}
            />
            <Title level={4} className="mt-3">
              Visit Us
            </Title>
            <Text type="secondary">
              Come to our main office during business hours for in-person
              support.
            </Text>
            <br />
            <Text strong style={{ color: "#4f46e5" }}>
               AA, Ethiopia
            </Text>
          </Card>
        </Col>
      </Row>

      {/* MESSAGE FORM */}
      <Row justify="center" className="mt-10">
        <Col xs={24} md={16} lg={12}>
          <Card className="rounded-2xl shadow-md">
            <Title level={3}>Send Us a Message</Title>
            <Text type="secondary">
              Fill out the form below and one of our representatives will get
              back to you.
            </Text>

            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              className="mt-6"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: "Enter your name" }]}
                  >
                    <Input placeholder="Your Name" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: "Enter email" },
                      { type: "email" },
                    ]}
                  >
                    <Input placeholder="you@email.com" />
                  </Form.Item>
                </Col>
              </Row>
             <Form.Item name="phone" label="Phone Number (optional)">
                <Input placeholder="+251 5677 8900" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Your Message"
                rules={[{ required: true, message: "Enter your message" }]}
              >
                <TextArea rows={5} placeholder="Type your message here..." />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="px-10"
              >
                Send Message
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 