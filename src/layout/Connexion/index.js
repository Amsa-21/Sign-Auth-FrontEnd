import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  message,
  Button,
  Form,
  Input,
  Typography,
  ConfigProvider,
  Checkbox,
} from "antd";
import "../../container/Sidenav/index.css";
import logo from "./images/logo.png";
import "../../container/Sidenav/index.css";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Connexion() {
  document.getElementById("title").innerHTML = "Connexion - Mandarga";

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  async function handleSubmit(values) {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email: values.email,
        password: values.password,
        remind: checked,
      });

      const data = response.data;
      if (data.success) {
        localStorage.setItem("accessToken", data.access_token);
        if (checked) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }
        localStorage.setItem("username", data.username);
        localStorage.setItem("telephone", data.telephone);
        localStorage.setItem("role", data.role);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        navigate("/");
      } else {
        message.error("Email ou mot de passe incorrect !");
        form.resetFields();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error);
        message.error(
          "Erreur d'authentification. Veuillez vérifier vos identifiants."
        );
      } else {
        message.error("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
      form.resetFields();
    } finally {
      setLoading(false);
    }
  }

  function handleCreate() {
    navigate("/subscription");
  }

  const onChange = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}>
      <div
        style={{
          display: "flex",
          width: 800,
          backgroundColor: "#2B2B2B",
          padding: 50,
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 40,
            marginBlock: 10,
            height: "100%",
          }}>
          <img
            src={logo}
            alt="logo du site"
            width={300}
            style={{ marginLeft: 30 }}
          />
          <h2 style={{ fontSize: 30, color: "#f5f1e9" }}>
            Prêt à signer vos documents en toute sécurité ?
          </h2>
          <p
            style={{
              fontSize: 16,
              textAlign: "justify",
              color: "rgba(245,241,232,.6)",
            }}>
            Améliorez vos processus de signature avec notre plateforme de
            signature électronique sécurisée, notre vérification d'identité
            avancée, et notre génération de certificats de conformité.
            Simplifiez la gestion de vos documents avec nos outils pratiques et
            nos ressources.
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          gap: 20,
          backgroundColor: "#F5F1E9",
        }}>
        <div style={{ width: 400 }}>
          <h1 style={{ fontSize: 30 }}>Identifiez-vous</h1>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelColor: "black",
                labelFontSize: 14,
              },
              Input: {
                colorBorder: "#5A3827",
                colorPrimaryHover: "#5A3827",
                activeBorderColor: "grey",
              },
              Checkbox: {
                colorPrimary: "#5A3827",
                colorBorder: "#5A3827",
                hoverBorderColor: "grey",
                colorPrimaryHover: "#5A3827",
              },
              Button: {
                defaultBg: "#5A3827",
                defaultHoverBg: "#F5F1E9",
                defaultColor: "#F5F1E9",
                defaultHoverColor: "#5A3827",
                defaultBorderColor: "#5A3827",
                defaultActiveColor: "#5A3827",
                defaultActiveBorderColor: "#5A3827",
                defaultHoverBorderColor: "#5A3827",
              },
              Typography: {
                colorLink: "#5A3827",
                colorLinkHover: "gray",
                fontSize: 16,
                colorLinkActive: "black",
              },
            },
          }}>
          <Form
            onFinish={handleSubmit}
            autoComplete="off"
            style={{ width: 400 }}
            colon={false}
            layout="vertical"
            form={form}>
            <Form.Item label="Email" name="email">
              <Input
                type="email"
                size="medium"
                placeholder="Entrer votre email"
                required
              />
            </Form.Item>
            <Form.Item label="Mot de passe" name="password">
              <Input.Password
                size="medium"
                placeholder="Entrer votre mot de passe"
                required
              />
            </Form.Item>
            <Form.Item name="reminder">
              <Checkbox onChange={onChange} checked={checked} size="medium">
                Se souvenir de moi
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                style={{
                  height: 40,
                  fontSize: 16,
                  width: 400,
                  fontWeight: "bold",
                }}
                htmlType="submit"
                loading={loading}>
                Identifiez-vous
              </Button>
            </Form.Item>
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
              }}></div>
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                marginTop: 15,
              }}>
              <Typography.Link underline={false} onClick={handleCreate}>
                Créer un nouveau compte
              </Typography.Link>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
}

export default Connexion;
