import React, { useState, useEffect } from "react";
import HomeLayout from "../../container";
import RequestList from "./RequestList";
import MyRequestList from "./MyRequestList";
import {
  Button,
  ConfigProvider,
  Radio,
  Spin,
  message,
  Popover,
  Checkbox,
  Divider,
} from "antd";
import axios from "axios";
import Card from "./Card";
import {
  DatabaseOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const CheckboxGroup = Checkbox.Group;

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Home() {
  document.getElementById("title").innerHTML = "Accueil - Fraud Detection";
  const [value, setValue] = useState("recieved");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const plainOptions = ["Complete", "En cours", "Rejetée"];
  const defaultCheckedList = ["Complete", "En cours", "Rejetée"];

  const [checkedList, setCheckedList] = useState(defaultCheckedList || []);
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;
  const onChange = (list) => {
    setCheckedList(list);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/allRequest`);
        setData(response.data.result);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  let dataWithKeys = data.map((item, _) => ({
    ...item,
  }));
  dataWithKeys = dataWithKeys.filter((item) => item.signers.includes(person));

  return (
    <HomeLayout>
      <Spin fullscreen spinning={loading} />
      {dataWithKeys && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: "25%",
              borderRadius: 7,
              boxShadow: "0 0 2px black",
              paddingInline: 20,
              backgroundColor: "rgb(43, 43, 43)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "20px",
              }}
            >
              <h5
                style={{
                  fontFamily: "Segoe UI, Arial, sans-serif",
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: 0,
                }}
              >
                Total des demandes
              </h5>
              <DatabaseOutlined style={{ fontSize: 20, color: "white" }} />
            </div>
            <h1
              style={{
                color: "#fff",
                margin: "10px 0",
              }}
            >
              {dataWithKeys.length}
            </h1>
          </div>
          <Card
            title="Demandes completes"
            icon={
              <UnorderedListOutlined
                style={{ fontSize: 20, color: "rgb(0, 0, 0)" }}
              />
            }
            value={dataWithKeys.filter((item) => item.status === 1).length}
          />
          <Card
            title="Demandes en cours"
            icon={
              <ReloadOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={dataWithKeys.filter((item) => item.status === 0).length}
          />
          <Card
            title="Demandes rejetées"
            icon={
              <CloseOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={dataWithKeys.filter((item) => item.status === 2).length}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBlock: 20,
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Radio: { colorPrimary: "#5A3827", colorPrimaryHover: "#5A3827" },
              Button: { colorPrimaryHover: "#5A3827" },
              Checkbox: {
                colorPrimary: "#5A3827",
                colorPrimaryHover: "#5A3827",
              },
            },
          }}
        >
          <div style={{ display: "flex", width: 360 }}>
            <Radio.Group
              defaultValue={value}
              buttonStyle="solid"
              onChange={(e) => {
                setValue(e.target.value);
                setCheckedList(defaultCheckedList);
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
          </div>

          <div
            style={{
              flex: 1,
              height: 1,
              borderRadius: 7,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          ></div>
          <div style={{ width: 40 }}>
            <Popover
              placement="rightTop"
              content={
                <div>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                  >
                    Tout selectionné
                  </Checkbox>
                  <Divider />
                  <CheckboxGroup
                    options={plainOptions}
                    value={checkedList}
                    onChange={onChange}
                  />
                </div>
              }
              title="Filtre"
              trigger="click"
            >
              <Button
                icon={
                  <FilterOutlined style={{ fontSize: 20, color: "5A3827" }} />
                }
              ></Button>
            </Popover>
          </div>
        </ConfigProvider>
      </div>
      {data && value === "recieved" ? (
        <RequestList data={data} checkList={checkedList} />
      ) : (
        <MyRequestList data={data} checkList={checkedList} />
      )}
    </HomeLayout>
  );
}

export default Home;
