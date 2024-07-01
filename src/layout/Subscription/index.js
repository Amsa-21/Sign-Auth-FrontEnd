import React, { useState } from "react";
import { Button, message, Steps, Layout, Typography, Form, Input } from "antd";
import { SolutionOutlined, CameraOutlined } from "@ant-design/icons";
import logo from "./images/logo_ST.png";
import VideoRecorder from "react-video-recorder-18";
import axios from "axios";

const { Header, Content, Sider } = Layout;

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Subscription() {
  document.getElementById("title").innerHTML = "Subscription - Fraud Detection";

  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [video, setVideo] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const next = (values) => {
    form
      .validateFields()
      .then(setUser(values))
      .then(() => {
        setCurrent(current + 1);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onRecordingComplete = (videoBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(videoBlob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setVideo(base64data);
    };
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user", JSON.stringify(user));
      formData.append("video", JSON.stringify(video));

      const response = await axios.post(`${API_URL}/addUser`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.success) {
        message.success("User registered successfully!");
      }
    } catch (error) {
      console.error(error);
      message.error("Add failed");
    }
    setLoading(false);
  };

  const steps = [
    {
      title: "Formulaire",
      content: (
        <>
          <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date de naissance"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item name="numero" label="Téléphone">
            <Input type="numero" />
          </Form.Item>
          <Form.Item
            name="organisation"
            label="Organisation"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="poste" label="Poste" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </>
      ),
      icon: <SolutionOutlined />,
    },
    {
      title: "Face Scan",
      content: (
        <>
          <div style={{ width: "50vh", height: "50vh" }}>
            <VideoRecorder onRecordingComplete={onRecordingComplete} />
          </div>
        </>
      ),
      icon: <CameraOutlined />,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    icon: item.icon,
  }));

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#072142",
        }}
      >
        <img src={logo} width="40px" height="40px" alt="Sign Auth logo" />
        <Typography.Title
          level={1}
          style={{ marginLeft: "15px", color: "white" }}
        >
          Sign Auth
        </Typography.Title>
      </Header>
      <Layout>
        <Sider
          style={{
            display: "flex",
            paddingBlock: 50,
            paddingInline: 20,
            borderRight: "1px solid rgba(12, 53, 106, 0.2)",
            backgroundColor: "white",
            fontSize: "14px",
          }}
        >
          <Steps
            style={{ height: "50%" }}
            direction={"vertical"}
            current={current}
            items={items}
          />
        </Sider>
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          <Form
            labelCol={{
              span: 6,
              offset: 0,
            }}
            wrapperCol={{
              span: 14,
              offset: 0,
            }}
            style={{
              paddingInline: "10%",
              paddingBlock: "5%",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            form={form}
            onFinish={next}
          >
            <div
              style={{
                overflow: "auto",
              }}
            >
              {steps[current].content}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                padding: 20,
              }}
            >
              {current > 0 && (
                <Button
                  style={{
                    margin: "0 10px",
                    width: 100,
                  }}
                  onClick={() => prev()}
                >
                  Retour
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button
                  style={{
                    width: 100,
                    backgroundColor: "#072142",
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Suivant
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  style={{
                    width: 100,
                    backgroundColor: "#072142",
                  }}
                  onClick={handleFinish}
                  loading={loading}
                >
                  Enregister
                </Button>
              )}
            </div>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
}
export default Subscription;
