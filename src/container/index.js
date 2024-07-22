import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Space, Dropdown, Menu } from "antd";
import routes from "../routes";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import logo from "./images/logo_ST.png";
const { Header, Content, Sider } = Layout;

function HomeLayout({ children }) {
  const [open, setOpen] = useState(false);

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
          paddingInline: 20,
        }}
      >
        <Typography.Link
          style={{ display: "flex", alignItems: "center", gap: 7 }}
          onClick={() => navigate("/home")}
        >
          <img src={logo} width={40} alt="Sign Auth logo" />
          <h2 style={{ color: "white", marginTop: 15 }}>Sign Auth</h2>
        </Typography.Link>

        <Dropdown
          menu={{
            items,
            defaultSelectedKeys: ["1"],
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Typography.Link
            type="text"
            style={{ height: "auto", color: "white" }}
          >
            <Space size={"middle"}>
              <UserOutlined
                style={{ fontSize: open ? 20 : 18, color: "white" }}
              />
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
                      {username}
                    </Typography.Text>
                    <Typography.Text italic={true} style={{ color: "#1677ff" }}>
                      Administrateur
                    </Typography.Text>
                  </>
                ) : (
                  <Typography.Text style={{ fontSize: 16, color: "white" }}>
                    {username}
                  </Typography.Text>
                )}
              </div>
              <DownOutlined
                rotate={open ? 180 : 0}
                style={{
                  fontSize: 18,
                  color: "white",
                }}
              />
            </Space>
          </Typography.Link>
        </Dropdown>
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
