import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../container/images/logo_ST.png";
import banner from "./images/banner.svg";
import { message, Button, Form, Input, Typography } from "antd";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Connexion() {
  document.getElementById("title").innerHTML = "Connexion - Fraud Detection";

  const [loading, setLoading] = useState(false);
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
        localStorage.setItem("role", data.role);
        navigate("/home");
      } else {
        message.error("Username or password incorrect!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error(error.data.error);
    }
    setLoading(false);
  }

  function handleCreate() {
    navigate("/subscription");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          backgroundColor: "#0C356A",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "ruby",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "arial",
              fontSize: 36,
              color: "white",
              marginBlockEnd: 100,
              paddingInline: 30,
            }}
          >
            Welcome to your application, Sign Auth
          </h1>
          <img src={banner} style={{ maxHeight: "400px" }} alt="Banner" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          height: "100%",
        }}
      >
        <div
          style={{
            borderRadius: 10,
            border: "1px solid #0C356A",
            minWidth: "400px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignItems: "center",
              paddingTop: 20,
            }}
          >
            <img src={logo} width={40} height={40} alt="Logo" />
            <h1 style={{ fontFamily: "arial", fontSize: 24, color: "#0C356A" }}>
              Login
            </h1>
          </div>
          <Form
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              padding: "25px",
            }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input type="email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              style={{
                display: "grid",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                style={{
                  backgroundColor: "#0C356A",
                  width: 150,
                  marginTop: 20,
                }}
                htmlType="submit"
                loading={loading}
              >
                Submit
              </Button>
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography.Link
                underline={true}
                style={{
                  color: "#0C356A",
                }}
                onClick={handleCreate}
              >
                Create a new account
              </Typography.Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
