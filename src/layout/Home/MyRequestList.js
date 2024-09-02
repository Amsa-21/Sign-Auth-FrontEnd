import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  message,
  Button,
  Table,
  Popconfirm,
  Tag,
  List,
  Divider,
  ConfigProvider,
  Spin,
  Checkbox,
  Popover,
} from "antd";
import {
  DeleteFilled,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeFilled,
  DatabaseOutlined,
  CloseOutlined,
  FilterOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Card from "../component/Card";
import ModalPDF from "../component/ModalPDF";

const CheckboxGroup = Checkbox.Group;

const API_URL = process.env.REACT_APP_API_BASE_URL;

function MyRequestList() {
  const [dataPDF, setDataPDF] = useState("");
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const plainOptions = ["Complete", "En cours", "Rejetée"];
  const defaultCheckedList = plainOptions;

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
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(`${API_URL}/allRequest`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.result);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const refreshResponse = await axios.post(
              `${API_URL}/refresh`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );
            const newAccessToken = refreshResponse.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);

            const retryResponse = await axios.get(`${API_URL}/allRequest`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            setData(retryResponse.data.result);
          } catch (refreshError) {
            console.error(
              "Erreur lors du rafraîchissement du token :",
              refreshError
            );
            message.error(
              "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
            );
          }
        } else {
          console.error("Erreur lors de la récupération des données :", error);
          message.error(
            "Une erreur s'est produite lors de la récupération des données."
          );
        }
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
            style={{ width: 90 }}>
            En cours
          </Tag>
        );
      case 1:
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#87d068"
            style={{ width: 90 }}>
            Complete
          </Tag>
        );
      case 2:
        return (
          <Tag
            icon={<CloseCircleOutlined />}
            color="#f50"
            style={{ width: 90 }}>
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
              }}>
              {it
                .split(" ")
                .slice(0, -1)
                .map((elem) => elem)
                .join(" ")}
              <Tag
                style={{
                  color: "black",
                  fontWeight: "bold",
                  boxShadow: "0 0 2px black",
                }}
                bordered={false}>
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
    const accessToken = localStorage.getItem("accessToken");
    const params = new URLSearchParams({
      id: record.id,
    }).toString();
    try {
      const response = await axios.delete(
        `${API_URL}/deleteRequest?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        window.location.reload();
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(
            `${API_URL}/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.delete(
            `${API_URL}/deleteRequest?${params}`,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (retryResponse.data.success) {
            window.location.reload();
          } else {
            message.error(retryResponse.data.error);
          }
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token :",
            refreshError
          );
          message.error(
            "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
          );
        }
      } else {
        console.error("Erreur lors de l'annulation :", error);
        message.error("Une erreur s'est produite lors de l'annulation.");
      }
    }
  };

  const handleViewPDF = async (record) => {
    setLoad(true);
    const accessToken = localStorage.getItem("accessToken");
    const params = new URLSearchParams({
      id: record.id,
    }).toString();
    try {
      const response = await axios.post(
        `${API_URL}/getPDF?${params}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setDataPDF(response.data.result);
        setOpen(true);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(
            `${API_URL}/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);

          const retryResponse = await axios.post(
            `${API_URL}/getPDF?${params}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (retryResponse.data.success) {
            setDataPDF(retryResponse.data.result);
            setOpen(true);
          } else {
            message.error(retryResponse.data.error);
          }
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token :",
            refreshError
          );
          message.error(
            "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
          );
        }
      } else {
        console.error("Erreur lors de la récupération du PDF :", error);
        message.error(
          "Une erreur s'est produite lors de la récupération du PDF."
        );
      }
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
      width: 155,
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
            icon={<EyeFilled style={{ color: "rgb(90,56,39)" }} />}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft"
            title="Voulez-vous vraiment annuler cette demande ?"
            description="Annuler la demande"
            okText="Oui"
            cancelText="Non"
            onConfirm={() => handleCancel(record)}>
            <Button
              type="text"
              icon={<DeleteFilled style={{ color: "red" }} />}
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
      <ModalPDF
        open={open}
        onClose={() => setOpen(false)}
        content={
          dataPDF && (
            <div
              style={{
                display: "flex",
              }}>
              <embed
                type="application/pdf"
                src={URL.createObjectURL(base64toBlob(dataPDF))}
                width="100%"
                height="900px"
                style={{
                  borderRadius: "7px",
                  boxShadow: "0 0 2px black",
                }}
              />
            </div>
          )
        }
      />

      {databrute && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            marginBottom: 30,
          }}>
          <div
            style={{
              width: "25%",
              borderRadius: 7,
              boxShadow: "0 0 2px black",
              paddingInline: 20,
              backgroundColor: "rgb(43, 43, 43)",
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "20px",
              }}>
              <h5
                style={{
                  fontFamily: "Segoe UI, Arial, sans-serif",
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: 0,
                }}>
                Total des demandes
              </h5>
              <DatabaseOutlined style={{ fontSize: 20, color: "white" }} />
            </div>
            <h1
              style={{
                color: "#fff",
                margin: "10px 0",
              }}>
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
            color="#87d068"
          />
          <Card
            title="Demandes en cours"
            icon={
              <ReloadOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={databrute.filter((item) => item.status === 0).length}
            color="#108ee9"
          />
          <Card
            title="Demandes rejetées"
            icon={
              <CloseOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={databrute.filter((item) => item.status === 2).length}
            color="#ff5500"
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
        }}>
        <div
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}></div>
        <div
          style={{
            display: "flex",
            width: 40,
          }}>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
                Button: {
                  colorPrimaryHover: "#5A3827",
                  borderRadius: "6px 6px 6px 0",
                },
                Checkbox: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
              },
            }}>
            <Popover
              placement="rightTop"
              content={
                <div>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}>
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
              trigger="click">
              <Button
                style={{ width: 40 }}
                icon={
                  <FilterOutlined style={{ fontSize: 20, color: "5A3827" }} />
                }></Button>
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
        }}>
        <Table
          columns={columns}
          dataSource={dataWithKeys}
          size="small"
          bordered={false}
          style={{
            overflow: "auto",
            boxShadow: "0 0 2px black",
            borderRadius: 7,
          }}
          pagination={false}
        />
      </ConfigProvider>
    </>
  );
}

export default MyRequestList;
