import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Button, Table, Popconfirm, Tag, List } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function MyRequestList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
        return <Tag color="#108ee9">En cours</Tag>;
      case 1:
        return <Tag color="#87d068">Complete</Tag>;
      case 2:
        return <Tag color="#f50">Rejetée</Tag>;
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
      title: "Nom du fichier",
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: "Signataire(s)",
      dataIndex: "signataires",
      key: "signataires",
    },
    {
      title: "Commentaire",
      dataIndex: "comment",
      key: "comment",
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
      render: (_, record) => (
        <>
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

  return (
    <>
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
