import React, { useState } from "react";
import {
  Button,
  message,
  Steps,
  Layout,
  Typography,
  Form,
  Input,
  Spin,
} from "antd";
import { SolutionOutlined, CameraOutlined } from "@ant-design/icons";
import logo from "./images/logo_ST.png";
import VideoRecorder from "react-video-recorder-18";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const API_URL = process.env.REACT_APP_API_BASE_URL;

function Subscription() {
  document.getElementById("title").innerHTML = "Subscription - Fraud Detection";

  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const next = (values) => {
    if (values.password === values.password2) {
      form
        .validateFields()
        .then(setUser(values))
        .then(() => {
          setCurrent(current + 1);
        })
        .catch((info) => {
          console.log("Validate Failed:", info);
        });
    } else {
      message.error("Les mots de passes ne correspondent pas !");
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onRecordingComplete = (videoBlob) => {
    setVideo(videoBlob);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      if (video === null) {
        throw new Error(
          "Video recording is required before finishing the subscription."
        );
      }
      const formData = new FormData();
      formData.append("user", JSON.stringify(user));
      formData.append("file", video);
      const response = await axios.post(`${API_URL}/addUser`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        message.success("User registered successfully!");
        navigate("/login");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.toString());
    }
    setLoading(false);
  };

  const steps = [
    {
      title: "Formulaire",
      content: (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
              <Input style={{ width: 235 }} />
            </Form.Item>
            <Form.Item
              name="prenom"
              label="Prénom"
              rules={[{ required: true }]}
            >
              <Input style={{ width: 235 }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input type="email" style={{ width: 235 }} />
            </Form.Item>
            <Form.Item
              name="date"
              label="Date de naissance"
              rules={[{ required: true }]}
            >
              <Input type="date" style={{ width: 235 }} />
            </Form.Item>
          </div>
          <Form.Item
            name="numero"
            label="Téléphone"
            rules={[{ required: true }]}
          >
            <Input type="numero" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[{ required: true }]}
            >
              <Input.Password
                style={{ width: 235 }}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
            <Form.Item
              name="password2"
              label="Confirmer le mot de passe"
              rules={[{ required: true }]}
            >
              <Input.Password
                style={{ width: 235 }}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="organisation"
              label="Organisation"
              rules={[{ required: true }]}
            >
              <Input style={{ width: 235 }} />
            </Form.Item>
            <Form.Item name="poste" label="Poste" rules={[{ required: true }]}>
              <Input style={{ width: 235 }} />
            </Form.Item>
          </div>
        </>
      ),
      icon: <SolutionOutlined />,
    },
    {
      title: "Face Scan",
      content: (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50vh", height: "50vh" }}>
            <VideoRecorder onRecordingComplete={onRecordingComplete} />
          </div>
        </div>
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
        <img src={logo} width="35" height="35" alt="Sign Auth logo" />
        <Typography.Title
          level={3}
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
            justifyContent: "center",
            backgroundColor: "white",
            paddingBlock: "5%",
          }}
        >
          <Spin fullscreen spinning={loading} />
          <Form layout="vertical" form={form} onFinish={next}>
            <div style={{ minWidth: 500 }}>{steps[current].content}</div>
            <div
              style={{
                display: "flex",
                justifyContent: "right",
                marginBlockStart: 25,
              }}
            >
              {current > 0 && (
                <Button
                  style={{
                    margin: "0 10px",
                    width: 120,
                  }}
                  onClick={() => prev()}
                >
                  Retour
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button
                  style={{
                    width: 120,
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
                    width: 120,
                    backgroundColor: "#072142",
                  }}
                  onClick={handleFinish}
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
