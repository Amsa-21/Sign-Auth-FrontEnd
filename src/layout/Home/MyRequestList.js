import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  message,
  Button,
  Table,
  Popconfirm,
  Tag,
  List,
  Modal,
  Divider,
  ConfigProvider,
  Spin,
  Checkbox,
  Popover,
} from "antd";
import {
  DeleteTwoTone,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DatabaseOutlined,
  CloseOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Card from "./Card";
const CheckboxGroup = Checkbox.Group;

const API_URL = process.env.REACT_APP_API_BASE_URL;

function MyRequestList() {
  const [dataPDF, setDataPDF] = useState("");
  const [open2, setOpen2] = useState(false);
  const [load, setLoad] = useState(false);
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

  const statusControle = (item) => {
    switch (item) {
      case 0:
        return (
          <Tag
            icon={<SyncOutlined spin />}
            color="#108ee9"
            style={{ width: 85 }}
          >
            En cours
          </Tag>
        );
      case 1:
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#87d068"
            style={{ width: 85 }}
          >
            Complete
          </Tag>
        );
      case 2:
        return (
          <Tag
            icon={<CloseCircleOutlined />}
            color="#f50"
            style={{ width: 85 }}
          >
            Rejetée
          </Tag>
        );
      default:
    }
  };

  let stat = checkedList.map((item, _) => ({
    status:
      item === "Complete"
        ? 1
        : item === "En cours"
        ? 0
        : item === "Rejetée"
        ? 2
        : null,
  }));

  let dataWithKeys = data.map((item, index) => ({
    ...item,
    signataires: (
      <List
        dataSource={item.signers}
        renderItem={(it) =>
          it.includes("@") ? (
            <List.Item
              key={it}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              {it
                .split(" ")
                .slice(0, -1)
                .map((elem) => elem)
                .join(" ")}
              <Tag
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "rgba(43,43,43, .3)",
                  borderColor: "rgba(43,43,43, .6)",
                }}
              >
                EXT
              </Tag>
            </List.Item>
          ) : (
            <List.Item key={it}>
              {it
                .split(" ")
                .slice(0, -1)
                .map((elem) => elem)
                .join(" ")}
            </List.Item>
          )
        }
      />
    ),
    statut: statusControle(item.status),
    key: item.id || index,
  }));
  dataWithKeys = dataWithKeys.filter(
    (item) =>
      item.person === person && stat.some((s) => s.status === item.status)
  );

  const handleCancel = async (record) => {
    try {
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.delete(`${API_URL}/deleteRequest?${params}`);
      if (response.data.success) {
        window.location.reload();
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleViewPDF = async (record) => {
    try {
      setLoad(true);
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.post(`${API_URL}/getPDF?${params}`);

      if (response.data.success) {
        setDataPDF(response.data.result);
        setOpen2(true);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setLoad(false);
    }
  };

  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: 150,
      render: (_, record) => {
        const [time, date] = record.date.split(" ");
        const [hours, minutes] = time.split(":");
        const [day, month] = date.split("/");
        return `${parseInt(day)} ${mois[parseInt(month) - 1]} à ${parseInt(
          hours
        )}h ${parseInt(minutes)}mn`;
      },
    },
    {
      title: "Objet",
      dataIndex: "object",
      key: "object",
      width: "15%",
    },
    {
      title: "Commentaire",
      dataIndex: "comment",
      key: "comment",
      width: "30%",
    },
    {
      title: "Signataire(s)",
      dataIndex: "signataires",
      key: "signataires",
    },
    {
      title: "Durée",
      dataIndex: "dated",
      key: "dated",
      width: 150,
      render: (_, record) => {
        const [time, date] = record.date.split(" ");
        const formattedDate = date.split("/").reverse().join("-") + "T" + time;
        const givenDate = new Date(formattedDate);
        const now = new Date();
        const differenceInMs = now - givenDate;
        const hours = Math.floor((differenceInMs / 1000 / 60 / 60) % 24);
        const days = Math.floor(differenceInMs / 1000 / 60 / 60 / 24);
        return `${days} jours, ${hours} heures`;
      },
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      align: "center",
      width: 100,
    },
    {
      title: "Action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <>
          <Button
            type="text"
            onClick={() => handleViewPDF(record)}
            icon={<EyeOutlined style={{ color: "rgb(0, 100, 200)" }} />}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft"
            title="Voulez-vous vraiment annuler cette demande ?"
            description="Annuler la demande"
            okText="Oui"
            cancelText="Non"
            onConfirm={() => handleCancel(record)}
          >
            <Button
              type="text"
              icon={<DeleteTwoTone twoToneColor="rgb(256,0,0)" />}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  const base64toBlob = (string) => {
    const bytes = atob(string);
    let length = bytes.length;
    let out = new Uint8Array(length);
    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }
    return new Blob([out], { type: "application/pdf" });
  };

  let databrute = data.map((item, _) => ({
    ...item,
  }));
  databrute = databrute.filter((item) => item.person === person);

  return (
    <>
      <Spin fullscreen spinning={load || loading} />
      <Modal
        open={open2}
        title="Aperçu du document"
        footer={null}
        onCancel={() => {
          setOpen2(false);
        }}
        width={"90%"}
      >
        <Divider />
        {dataPDF && (
          <div style={{ display: "flex" }}>
            <embed
              type="application/pdf"
              src={URL.createObjectURL(base64toBlob(dataPDF))}
              width={"100%"}
              height={700}
            />
          </div>
        )}
      </Modal>

      {databrute && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            marginBottom: 30,
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
              {databrute.length}
            </h1>
          </div>
          <Card
            title="Demandes completes"
            icon={
              <UnorderedListOutlined
                style={{ fontSize: 20, color: "rgb(0, 0, 0)" }}
              />
            }
            value={databrute.filter((item) => item.status === 1).length}
          />
          <Card
            title="Demandes en cours"
            icon={
              <ReloadOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={databrute.filter((item) => item.status === 0).length}
          />
          <Card
            title="Demandes rejetées"
            icon={
              <CloseOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={databrute.filter((item) => item.status === 2).length}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            width: 40,
          }}
        >
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
                Button: { colorPrimaryHover: "#5A3827" },
                Checkbox: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
              },
            }}
          >
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
                style={{ width: 40 }}
                icon={
                  <FilterOutlined style={{ fontSize: 20, color: "5A3827" }} />
                }
              ></Button>
            </Popover>
          </ConfigProvider>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#2b2b2b",
              headerColor: "white",
              rowHoverBg: "#fff",
              colorPrimary: "#5A3827",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={dataWithKeys}
          size="small"
          bordered={false}
          style={{
            overflow: "auto",
            boxShadow: "0 0 2px black",
            backgroundColor: "white",
            borderRadius: 7,
          }}
          pagination={false}
        />
      </ConfigProvider>
    </>
  );
}

export default MyRequestList;
