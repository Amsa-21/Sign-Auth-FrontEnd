import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import logo from "../../container/images/logo_ST.png";
import banner from "./images/banner.svg";
import { message, Button, Form, Input } from "antd";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Connexion() {
  const [redirectToHome, setRedirectToHome] = useState(false);

  document.getElementById("title").innerHTML = "Connexion - Fraud Detection";

  async function handleSubmit(values) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: values.username,
        password: values.password,
      });
      const data = response.data;
      if (data.success === true) {
        localStorage.setItem("userToken", data.userToken);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        setRedirectToHome(true);
      } else {
        message.error("Username or password incorrect!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      message.error(error.response.data.error);
    }
  }
  if (redirectToHome) {
    return <Navigate to="/home" replace={true} />;
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
          paddingInline: 30,
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
            borderRadius: "8px",
            boxShadow: "0px 0px 7px rgba(12, 53, 106, 0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignItems: "center",
              padding: "25px",
            }}
          >
            <img src={logo} width={40} height={40} alt="Logo" />
            <h1 style={{ fontFamily: "arial", fontSize: 24, color: "#0C356A" }}>
              Login
            </h1>
          </div>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 700,
              padding: "25px",
            }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
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
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="primary"
                style={{
                  backgroundColor: "#0C356A",
                }}
                htmlType="submit"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
