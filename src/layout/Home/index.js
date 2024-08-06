import React from "react";
import HomeLayout from "../../container";
import CreateRequest from "./CreateRequest";
import RequestList from "./RequestList";
import MyRequestList from "./MyRequestList";
import { Tabs } from "antd";
import { PaperClipOutlined, UnorderedListOutlined } from "@ant-design/icons";

function Home() {
  document.getElementById("title").innerHTML = "Home - Fraud Detection";

  const items = [
    {
      label: "Liste des demandes",
      key: 1,
      children: <RequestList />,
      icon: <UnorderedListOutlined />,
    },
    {
      label: "Mes demandes",
      key: 2,
      children: <MyRequestList />,
      icon: <UnorderedListOutlined />,
    },
    {
      label: "Créer une nouvelle demande",
      key: 3,
      children: <CreateRequest />,
      icon: <PaperClipOutlined />,
    },
  ];

  return (
    <HomeLayout>
      <Tabs animated={true} defaultActiveKey={1} items={items} />
    </HomeLayout>
  );
}

export default Home;
