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
  FilterFilled,
} from "@ant-design/icons";
const CheckboxGroup = Checkbox.Group;

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Home() {
  document.getElementById("title").innerHTML = "Home - Fraud Detection";
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
          <Card
            title="Total des demandes"
            icon={<DatabaseOutlined style={{ fontSize: 20, color: "white" }} />}
            value={dataWithKeys.length}
            color="#2b2b2b"
          />
          <Card
            title="Demandes completes"
            icon={
              <UnorderedListOutlined style={{ fontSize: 20, color: "white" }} />
            }
            value={dataWithKeys.filter((item) => item.status === 1).length}
            color="#87d068"
          />
          <Card
            title="Demandes en attentes"
            icon={<ReloadOutlined style={{ fontSize: 20, color: "white" }} />}
            value={dataWithKeys.filter((item) => item.status === 0).length}
            color="#108ee9"
          />
          <Card
            title="Demandes refusées"
            icon={
              <UnorderedListOutlined style={{ fontSize: 20, color: "white" }} />
            }
            value={dataWithKeys.filter((item) => item.status === 2).length}
            color="#ff5500"
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          marginBlock: 20,
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
          <Radio.Group
            defaultValue={value}
            buttonStyle="solid"
            onChange={(e) => {
              setValue(e.target.value);
              setCheckedList(defaultCheckedList);
            }}
          >
            <Radio.Button value="recieved">Demandes reçues</Radio.Button>
            <Radio.Button value="sent">Demandes envoyées</Radio.Button>
          </Radio.Group>
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
            <Button>
              <FilterFilled style={{ color: "5A3827" }} />
            </Button>
          </Popover>
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
