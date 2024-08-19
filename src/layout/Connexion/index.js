import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import background from "./images/bg.jpg";
import bg from "./images/background.jpg";
import {
  message,
  Button,
  Form,
  Input,
  Typography,
  Image,
  ConfigProvider,
} from "antd";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Connexion() {
  document.getElementById("title").innerHTML = "Connexion - Fraud Detection";

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email: values.email,
        password: values.password,
      });
      const data = response.data;
      if (data.success === true) {
        localStorage.setItem("userToken", data.userToken);
        localStorage.setItem("username", data.username);
        localStorage.setItem("telephone", data.telephone);
        localStorage.setItem("role", data.role);
        navigate("/home");
      } else {
        message.error("Email ou mot de passe incorrect !");
        form.resetFields();
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    navigate("/subscription");
  }

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          height: "100vh",
          backdropFilter: "blur(10px) brightness(70%)",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
            marginBlock: 70,
          }}
        >
          <div style={{ textAlign: "center", width: 600 }}>
            <Typography.Title style={{ fontSize: 30, color: "white" }}>
              Accédez à votre compte pour signer et protéger vos documents en
              toute sécurité.
            </Typography.Title>
          </div>
          <div
            style={{
              borderRadius: 10,
              height: 650,
              width: 500,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              boxShadow: "0 0 50px black",
            }}
          >
            <Image
              preview={false}
              alt="Background image"
              src={background}
              height={325}
              width={500}
              style={{ borderRadius: "10px 10px 0 0" }}
            />
            <ConfigProvider
              theme={{
                components: {
                  Form: {
                    labelColor: "white",
                  },
                  Button: {
                    defaultBg: "#5A3827",
                    defaultHoverBg: "#F5F1E9",
                    defaultColor: "#F5F1E9",
                    defaultHoverColor: "#5A3827",
                    defaultHoverBorderColor: "#F5F1E9",
                    defaultBorderColor: "#5A3827",
                    defaultActiveColor: "#5A3827",
                    defaultActiveBorderColor: "#5A3827",
                  },
                  Typography: {
                    colorLink: "white",
                    colorLinkHover: "#5A3827",
                  },
                },
              }}
            >
              <Form
                style={{
                  padding: "25px",
                  marginInline: 50,
                }}
                onFinish={handleSubmit}
                autoComplete="off"
                colon={false}
                layout="vertical"
                form={form}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez renseigner votre email !",
                    },
                  ]}
                >
                  <Input
                    type="email"
                    size="medium"
                    placeholder="Entrer votre email"
                  />
                </Form.Item>
                <Form.Item
                  label="Mot de passe"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez renseigner votre mot de passe !",
                    },
                  ]}
                >
                  <Input.Password
                    size="medium"
                    placeholder="Entrer votre mot de passe"
                  />
                </Form.Item>
                <Form.Item
                  style={{
                    display: "grid",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    type="default"
                    style={{
                      width: 150,
                      marginTop: 15,
                    }}
                    htmlType="submit"
                    loading={loading}
                  >
                    Connexion
                  </Button>
                </Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography.Link underline={true} onClick={handleCreate}>
                    Créer un nouveau compte
                  </Typography.Link>
                </div>
              </Form>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
