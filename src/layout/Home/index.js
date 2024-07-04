import React from "react";
import HomeLayout from "../../container";
import Analysis from "./Analysis";
import Sign from "./Sign";
import { Tabs } from "antd";
import { ScanOutlined, SignatureOutlined } from "@ant-design/icons";

function Home() {
  document.getElementById("title").innerHTML = "Home - Fraud Detection";

  const items = [
    {
      label: "Vérification de signature",
      key: 1,
      children: <Analysis />,
      icon: <ScanOutlined />,
    },
    {
      label: "Signature de document",
      key: 2,
      children: <Sign />,
      icon: <SignatureOutlined />,
    },
  ];

  return (
    <HomeLayout>
      <Tabs animated={true} defaultActiveKey={1} items={items} />
    </HomeLayout>
  );
}

export default Home;
