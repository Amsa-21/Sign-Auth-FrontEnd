import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Typography,
  Dropdown,
  Divider,
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

const API_URL = process.env.REACT_APP_API_BASE_URL;

function HomeLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("telephone");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleEditPassword = () => {
    setOpenModal(true);
  };

  const handleSubmit = async (values) => {
    if (values.password === values.confirmpassword) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("datas", JSON.stringify(values));
        formData.append("tel", localStorage.getItem("telephone"));

        const response = await axios.post(
          `${API_URL}/changePassword`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          message.success("Mot de passe mis à jour !");
        } else {
          message.error("Mot de passe actuel incorrect !");
        }
      } catch (error) {
        console.error(error);
        message.error(error.toString());
      } finally {
        form.resetFields();
        setLoading(false);
        setOpenModal(false);
      }
    } else {
      message.warning("Les mots de passes ne correspondent pas !");
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
        }}
      >
        <Modal
          open={openModal}
          title="Changer de mot de passe"
          footer={null}
          onCancel={() => {
            setOpenModal(false);
          }}
          destroyOnClose={true}
          onClose={() => form.resetFields()}
        >
          <Divider />
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Ancien mot de passe"
              name="prepassword"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre mot de passe",
                },
              ]}
            >
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
              ]}
            >
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
              ]}
            >
              <Input.Password placeholder="Confirmer le nouveau mot de passe" />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  marginTop: 20,
                }}
              >
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
                  }}
                >
                  <Button loading={loading} htmlType="submit">
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
          onClick={() => navigate("/")}
        >
          <h2 style={{ color: "white", marginTop: 15 }}>Mandarga</h2>
        </Typography.Link>
        <div
          style={{
            display: "flex",
            height: "fit-content",
            color: "white",
            gap: 10,
          }}
        >
          <UserOutlined style={{ fontSize: 18, color: "white" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {role === "Admin" ? (
              <>
                <Typography.Text style={{ fontSize: 16, color: "white" }}>
                  Bienvenue, {username}
                </Typography.Text>
                <Typography.Text
                  italic={true}
                  style={{ fontSize: 12, color: "#8A8A8A" }}
                >
                  Super administrateur
                </Typography.Text>
              </>
            ) : (
              <>
                <Typography.Text style={{ fontSize: 16, color: "white" }}>
                  Bienvenue, {username}
                </Typography.Text>
                <Typography.Text
                  italic={true}
                  style={{ fontSize: 12, color: "#8A8A8A" }}
                >
                  Utilisateur interne
                </Typography.Text>
              </>
            )}
          </div>
          <Dropdown
            menu={{
              items,
            }}
            onOpenChange={() => setOpen(!open)}
          >
            <CaretDownOutlined
              rotate={open ? 180 : 0}
              style={{
                fontSize: 18,
                color: "white",
              }}
            />
          </Dropdown>
        </div>
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <Sidenav />
        </Layout.Sider>
        <Layout.Content
          style={{
            paddingInline: "5%",
            paddingBlock: "5%",
            backgroundColor: "#F5F1E9",
            overflow: "auto",
          }}
        >
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
