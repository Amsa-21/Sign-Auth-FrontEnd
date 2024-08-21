import React from "react";
import HomeLayout from "../../container";
import RequestList from "./RequestList";
import MyRequestList from "./MyRequestList";
import { ConfigProvider, Tabs } from "antd";

function Home() {
  document.getElementById("title").innerHTML = "Accueil - Fraud Detection";

  const items = [
    {
      key: "1",
      label: "Demandes reçues",
      children: <RequestList />,
    },
    {
      key: "2",
      label: "Demandes envoyées",
      children: <MyRequestList />,
    },
  ];

  return (
    <HomeLayout>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              colorPrimary: "#5a3827",
              itemActiveColor: "#2b2b2b",
              itemHoverColor: "#5a3827",
            },
          },
        }}
      >
        <Tabs defaultActiveKey="1" centered items={items} size="large" />
      </ConfigProvider>
    </HomeLayout>
  );
}

export default Home;
