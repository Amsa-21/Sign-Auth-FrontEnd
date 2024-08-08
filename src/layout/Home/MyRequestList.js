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
} from "antd";
import {
  DeleteTwoTone,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function MyRequestList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataPDF, setDataPDF] = useState("");
  const [open2, setOpen2] = useState(false);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/allRequest`);
        setData(response.data.result);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        message.error(error.message);
      }
      setLoading(false);
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

  let dataWithKeys = data.map((item, index) => ({
    ...item,
    signataires: (
      <List
        dataSource={item.signers}
        renderItem={(it) => <List.Item key={it}>{it}</List.Item>}
      />
    ),
    statut: statusControle(item.status),
    key: item.id || index,
  }));
  dataWithKeys = dataWithKeys.filter((item) => item.person === person);

  const handleCancel = async (record) => {
    try {
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.delete(`${API_URL}/deleteRequest?${params}`);
      if (response.data.success) {
        setData(response.data.result);
        message.success("Demande annulée avec succès");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleViewPFDF = async (record) => {
    try {
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.post(`${API_URL}/getPDF?${params}`);

      if (response.data.success) {
        setDataPDF(response.data.result);
        console.log(dataPDF);
        setOpen2(true);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Objet",
      dataIndex: "object",
      key: "object",
    },
    {
      title: "Commentaire",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Signataire(s)",
      dataIndex: "signataires",
      key: "signataires",
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      align: "center",
    },
    {
      title: "OPTIONS",
      align: "center",
      width: 100,
      render: (_, record) => (
        <>
          <Button
            type="text"
            onClick={() => handleViewPFDF(record)}
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
      <Modal
        open={open2}
        title={<p>Aperçu du Document</p>}
        footer={null}
        onCancel={() => {
          setOpen2(false);
        }}
        width={"80%"}
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
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        size="small"
        bordered={true}
        loading={loading}
        style={{ overflow: "auto" }}
      />
    </>
  );
}

export default MyRequestList;
