import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layout,
  Typography,
  Dropdown,
  Menu,
  Divider,
  Modal,
  Button,
  Form,
  Input,
  message,
} from "antd";
import routes from "../routes";
import {
  UserOutlined,
  LogoutOutlined,
  CaretDownOutlined,
  EditOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import logo from "./images/logo_ST.png";
const { Header, Content, Sider } = Layout;

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
      message.error("Les mots de passes ne correspondent pas !");
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

  const item = routes
    .filter((route) => {
      if (
        localStorage.getItem("role").toLowerCase() === "admin" ||
        (localStorage.getItem("role").toLowerCase() === "user" &&
          route.role === "user")
      ) {
        return true;
      }
      return false;
    })
    .map((route) => ({
      ...route,
      onClick: () => navigate(route.path),
    }));

  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#072142",
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
          onClose={form.resetFields()}
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
                <Button
                  style={{ backgroundColor: "#072142", color: "white" }}
                  loading={loading}
                  htmlType="submit"
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
        <Typography.Link
          style={{
            display: "flex",
            height: "64px",
            alignItems: "center",
            gap: 7,
          }}
          onClick={() => navigate("/home")}
        >
          <img src={logo} width={40} alt="Sign Auth logo" />
          <h2 style={{ color: "white", marginTop: 15 }}>Sign Auth</h2>
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
                  style={{ fontSize: 12, color: "#1677ff" }}
                >
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
                  style={{ fontSize: 12, color: "#1677ff" }}
                >
                  Utilisateur
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
      </Header>
      <Layout>
        <Sider
          collapsed={collapsed}
          onMouseEnter={() => {
            setCollapsed(false);
          }}
          onMouseLeave={() => {
            setCollapsed(true);
          }}
          style={{ backgroundColor: "#0C356A" }}
        >
          <Menu
            defaultSelectedKeys={[
              item.find((item) => item.path === window.location.pathname)
                ?.key || "1",
            ]}
            mode="vertical"
            items={item}
            theme="dark"
            style={{
              color: "white",
              backgroundColor: "#0C356A",
              fontSize: "14px",
            }}
          />
        </Sider>
        <Content
          style={{
            overflow: "auto",
            paddingInline: "10%",
            paddingBlock: "5%",
            backgroundColor: "white",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HomeLayout;
