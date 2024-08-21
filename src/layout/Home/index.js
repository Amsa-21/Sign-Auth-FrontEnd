import React, { useState } from "react";
import HomeLayout from "../../container";
import RequestList from "./RequestList";
import MyRequestList from "./MyRequestList";
import { ConfigProvider, Radio } from "antd";

function Home() {
  document.getElementById("title").innerHTML = "Accueil - Fraud Detection";
  const [value, setValue] = useState("recieved");

  return (
    <HomeLayout>
      <div style={{ display: "flex", width: 360, marginBottom: 30 }}>
        <ConfigProvider
          theme={{
            components: {
              Radio: { colorPrimary: "#5A3827", colorPrimaryHover: "#5A3827" },
            },
          }}
        >
          <Radio.Group
            defaultValue={value}
            buttonStyle="solid"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            style={{ width: "100%" }}
          >
            <Radio.Button
              value="recieved"
              style={{ width: "50%", textAlign: "center" }}
            >
              Demandes reçues
            </Radio.Button>
            <Radio.Button
              value="sent"
              style={{ width: "50%", textAlign: "center" }}
            >
              Demandes envoyées
            </Radio.Button>
          </Radio.Group>
        </ConfigProvider>
      </div>
      {value === "recieved" ? <RequestList /> : <MyRequestList />}
    </HomeLayout>
  );
}

export default Home;
