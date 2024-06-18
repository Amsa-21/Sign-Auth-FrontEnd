import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "@react-login-page/page11";
import logo from "../../container/images/logo_ST.png";
import banner from "./images/banner.svg";
import {
  Username,
  Password,
  Submit,
  Logo,
  Title,
  Banner,
} from "@react-login-page/page11";
import { message } from "antd";
import API_URL from "../../config";

const css = {
  "--login-bg": "#0C356A",
  "--login-color": "#fff",
  "--login-input": "#fff",
  "--login-input-border": "#4d5d69",
  "--login-input-hover": "#434a52",
  "--login-input-focus": "rgba(0, 142, 240, 0.46)",
  "--login-input-placeholder": "#838383",
  "--login-btn": "var(--login-color)",
  "--login-btn-bg": "#279EFF",
  "--login-btn-focus": "rgba(0, 142, 240, 0.26)",
  "--login-btn-hover": "#1b75bf",
  "--login-btn-active": "var(--login-bg)",
};

function Connexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);

  document.getElementById("title").innerHTML = "Connexion - Fraud Detection";

  async function login() {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password,
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
    <LoginPage style={{ width: "100%", height: "100vh", ...css }}>
      <Banner>
        <img src={banner} alt="banner" />
      </Banner>
      <Logo>
        <img src={logo} width={50} height={50} alt="logo" />
      </Logo>
      <Title>Sign Auth</Title>
      <Username onChange={(e) => setUsername(e.target.value)} />
      <Password onChange={(e) => setPassword(e.target.value)} />
      <Submit
        onClick={() => {
          login();
        }}
      >
        Connexion
      </Submit>
    </LoginPage>
  );
}

export default Connexion;
