import React, { useState } from "react";
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
} from "antd";
import {
  DeleteTwoTone,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function MyRequestList({ data, checkList }) {
  const [dataPDF, setDataPDF] = useState("");
  const [open2, setOpen2] = useState(false);
  const [load, setLoad] = useState(false);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

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

  let stat = checkList.map((item, _) => ({
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
            <List.Item key={it}>
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
              {it}
            </List.Item>
          ) : (
            <List.Item key={it}>{it}</List.Item>
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
      width: 100,
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

  return (
    <>
      <Spin fullscreen spinning={load} />
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

MyRequestList.propTypes = {
  data: PropTypes.array,
  checkList: PropTypes.array,
};

export default MyRequestList;
