import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Space, Dropdown, Button, Menu } from "antd";
import routes from "../routes";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import logo from "./images/logo_ST.png";
const { Header, Content, Sider } = Layout;

function HomeLayout({ children }) {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const items = [
    {
      label: "Logout",
      key: "1",
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
        }}
      >
        <Button
          type="text"
          style={{
            display: "flex",
            alignItems: "center",
            height: "auto",
          }}
          onClick={() => navigate("/home")}
        >
          <img src={logo} width="35px" height="35px" alt="Sign Auth logo" />
          <Typography.Title
            level={3}
            style={{ marginLeft: "15px", color: "white" }}
          >
            Sign Auth
          </Typography.Title>
        </Button>

        <Dropdown
          style={{ display: "block" }}
          menu={{
            items,
            selectable: true,
            defaultSelectedKeys: ["1"],
          }}
        >
          <Button
            type="text"
            style={{ height: "auto", color: "white" }}
            onClick={(e) => e.preventDefault()}
          >
            <Space size={"middle"}>
              <UserOutlined style={{ fontSize: 18, color: "white" }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography.Text style={{ color: "white" }}>
                  {username}
                </Typography.Text>
                <Typography.Text italic={true} style={{ color: "white" }}>
                  {role}
                </Typography.Text>
              </div>
              <DownOutlined style={{ fontSize: 18, color: "white" }} />
            </Space>
          </Button>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          collapsible
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
            mode="inline"
            theme="dark"
            items={item}
            style={{ backgroundColor: "#0C356A", fontSize: "14px" }}
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
