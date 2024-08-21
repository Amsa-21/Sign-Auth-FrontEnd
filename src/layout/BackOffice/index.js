import React from "react";
import HomeLayout from "../../container";
import { ConfigProvider, Tabs } from "antd";
import {
  UnorderedListOutlined,
  DatabaseOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import FormModal from "./FormModal";
import ApprovedList from "./ApprovedList";
import Analysis from "./Analysis";

function BackOffice() {
  const items = [
    {
      label: "Own Approved Trust List Member",
      key: 1,
      children: <FormModal />,
      icon: <UnorderedListOutlined />,
    },
    {
      label: "Analysis",
      key: 2,
      children: <Analysis />,
      icon: <ScanOutlined />,
    },
    {
      label: "Adobe Approved Trust List Member",
      key: 3,
      children: <ApprovedList />,
      icon: <DatabaseOutlined />,
    },
  ];

  document.getElementById("title").innerHTML = "Back Office - Fraud Detection";

  return (
    <HomeLayout>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 700 }}>
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  colorPrimary: "rgb(90,56,39)",
                  itemHoverColor: "rgb(90,56,39)",
                  itemActiveColor: "#2b2b2b",
                },
              },
            }}
          >
            <Tabs animated={true} defaultActiveKey={1} items={items} />
          </ConfigProvider>
        </div>
      </div>
    </HomeLayout>
  );
}

export default BackOffice;
