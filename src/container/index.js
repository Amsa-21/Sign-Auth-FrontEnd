import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Typography,
  Dropdown,
  Modal,
  Button,
  Form,
  Input,
  message,
  ConfigProvider,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  CaretDownOutlined,
  EditOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import Sidenav from "./Sidenav";
import logo from "./images/logo.png";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function HomeLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  const clearLocalStorage = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("telephone");
    sessionStorage.removeItem("role");
  };

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    let refreshToken = Boolean(sessionStorage.getItem("refreshToken"));
    if (refreshToken) {
      refreshToken = sessionStorage.getItem("refreshToken");
    }

    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      clearLocalStorage();
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 401 && refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${API_URL}/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const newAccessToken = refreshResponse.data.access_token;
          sessionStorage.setItem("accessToken", newAccessToken);

          await axios.post(
            `${API_URL}/logout`,
            {},
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );
          clearLocalStorage();
          navigate("/login");
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token :",
            refreshError
          );
          message.error(
            "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
          );
        }
      } else if (error.response && error.response.status === 401) {
        clearLocalStorage();
        navigate("/login");
      } else {
        console.error("Erreur lors de la déconnexion :", error);
        message.error("Une erreur s'est produite lors de la déconnexion.");
      }
    }
  };

  const handleEditPassword = () => {
    setOpenModal(true);
  };

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmpassword) {
      message.warning("Les mots de passe ne correspondent pas !");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("datas", JSON.stringify(values));
    formData.append("tel", sessionStorage.getItem("telephone"));

    const accessToken = sessionStorage.getItem("accessToken");
    let refreshToken = Boolean(sessionStorage.getItem("refreshToken"));
    if (refreshToken) {
      refreshToken = sessionStorage.getItem("refreshToken");
    }

    try {
      const response = await axios.post(`${API_URL}/changePassword`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        message.success("Mot de passe mis à jour !");
      } else {
        message.error("Mot de passe actuel incorrect !");
      }
    } catch (error) {
      if (error.response && error.response.status === 401 && refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${API_URL}/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const newAccessToken = refreshResponse.data.access_token;
          sessionStorage.setItem("accessToken", newAccessToken);

          const retryResponse = await axios.post(
            `${API_URL}/changePassword`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (retryResponse.data.success) {
            message.success("Mot de passe mis à jour !");
          } else {
            message.error("Mot de passe actuel incorrect !");
          }
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token :",
            refreshError
          );
          message.error(
            "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
          );
        }
      } else if (error.response && error.response.status === 401) {
        clearLocalStorage();
        navigate("/login");
      } else {
        console.error("Erreur lors de la mise à jour du mot de passe :", error);
        message.error(
          "Une erreur s'est produite lors de la mise à jour du mot de passe."
        );
      }
    } finally {
      form.resetFields();
      setLoading(false);
      setOpenModal(false);
    }
  };

  const items = [
    {
      label: "Changer de mot de passe",
      key: "1",
      icon: <EditOutlined />,
      onClick: handleEditPassword,
    },
    {
      label: "Déconnexion",
      key: "2",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#2B2B2B",
          alignItems: "center",
          paddingInline: 20,
        }}>
        <Modal
          open={openModal}
          centered
          footer={null}
          onCancel={() => {
            setOpenModal(false);
          }}
          destroyOnClose={true}
          onClose={() => form.resetFields()}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Ancien mot de passe"
              name="prepassword"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre mot de passe",
                },
              ]}>
              <Input.Password placeholder="Entrer le mot de passe actuel" />
            </Form.Item>
            <Form.Item
              label="Nouveau mot de passe"
              name="password"
              rules={[
                {
                  min: 8,
                  message: "Le mot de passe est trop court",
                },
                {
                  required: true,
                  message: "Veuillez saisir le nouveau mot de passe",
                },
              ]}>
              <Input.Password placeholder="Entrez le nouveau mot de passe" />
            </Form.Item>
            <Form.Item
              label="Confirmation de mot de passe"
              name="confirmpassword"
              rules={[
                {
                  required: true,
                  message: "Veuillez confirmer le nouveau mot de passe",
                },
              ]}>
              <Input.Password placeholder="Confirmer le nouveau mot de passe" />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginTop: 20,
                }}>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        defaultBg: "#5A3827",
                        defaultHoverBg: "#fff",
                        defaultColor: "#fff",
                        defaultHoverColor: "#5A3827",
                        defaultHoverBorderColor: "#5A3827",
                        defaultBorderColor: "#5A3827",
                        defaultActiveColor: "#5A3827",
                        defaultActiveBg: "#8a8a8a",
                        defaultActiveBorderColor: "#5A3827",
                      },
                    },
                  }}>
                  <Button
                    loading={loading}
                    style={{ height: 40 }}
                    htmlType="submit">
                    Enregistrer les modifications
                  </Button>
                </ConfigProvider>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Typography.Link
          style={{
            display: "flex",
            height: "64px",
            alignItems: "center",
          }}
          onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo du site"
            width={120}
            style={{ marginLeft: 25 }}
          />
        </Typography.Link>
        <ConfigProvider
          theme={{
            components: {
              Dropdown: { controlItemBgHover: "#f5f1e9", colorText: "#2b2b2b" },
            },
          }}>
          <Dropdown
            menu={{
              items,
            }}
            trigger={"click"}
            onOpenChange={() => setOpen(!open)}>
            <div
              style={{
                display: "flex",
                height: "fit-content",
                color: "white",
                gap: 10,
                cursor: "pointer",
              }}>
              <UserOutlined style={{ fontSize: 18, color: "white" }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                {role === "Admin" ? (
                  <>
                    <Typography.Text style={{ fontSize: 16, color: "white" }}>
                      Bienvenue, {username}
                    </Typography.Text>
                    <Typography.Text
                      italic={true}
                      style={{ fontSize: 12, color: "#8A8A8A" }}>
                      Administrateur
                    </Typography.Text>
                  </>
                ) : (
                  <>
                    <Typography.Text style={{ fontSize: 16, color: "white" }}>
                      Bienvenue, {username}
                    </Typography.Text>
                    <Typography.Text
                      italic={true}
                      style={{ fontSize: 12, color: "#8A8A8A" }}>
                      Utilisateur interne
                    </Typography.Text>
                  </>
                )}
              </div>
              <CaretDownOutlined
                rotate={open ? 180 : 0}
                style={{
                  fontSize: 18,
                  color: "white",
                }}
              />
            </div>
          </Dropdown>
        </ConfigProvider>
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <Sidenav />
        </Layout.Sider>
        <Layout.Content
          style={{
            paddingInline: "5%",
            paddingBlock: "70px",
            backgroundColor: "#F5F1E9",
            overflow: "auto",
          }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HomeLayout;
