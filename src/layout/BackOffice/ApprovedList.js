import React, { useState, useEffect } from "react";
import axios from "axios";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  Typography,
  message,
  Collapse,
  Spin,
  Table,
  ConfigProvider,
} from "antd";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function ApprovedList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
  
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/data`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.result);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const refreshResponse = await axios.post(`${API_URL}/refresh`, {}, {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            });
  
            const newAccessToken = refreshResponse.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            const retryResponse = await axios.get(`${API_URL}/data`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
  
            setData(retryResponse.data.result);
          } catch (refreshError) {
            console.error("Erreur lors du rafraîchissement du token :", refreshError);
            message.error("Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter.");
          }
        } else {
          console.error("Erreur lors de la récupération des données :", error);
          message.error("Loading failed");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);  

  const groupByCodePaysRegion = () => {
    const groupedData = {};
    data.forEach((item) => {
      const codePaysRegion = item.codePaysRegion;
      if (!groupedData[codePaysRegion]) {
        groupedData[codePaysRegion] = [];
      }
      groupedData[codePaysRegion].push(item);
    });
    return groupedData;
  };

  return TrustList(groupByCodePaysRegion(), loading);
}

function TrustList(c, loading) {
  const items = [];

  Object.entries(c).map(([codePaysRegion, item]) =>
    items.push({
      key: codePaysRegion,
      label: (
        <Typography.Text strong style={{ color: "#000" }}>
          {codePaysRegion}
        </Typography.Text>
      ),
      children: Tables(item),
    })
  );

  return (
    <>
      <Spin fullscreen={true} spinning={loading} />
      <Collapse
        accordion={true}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            rotate={isActive ? 90 : 0}
            style={{ color: "#000" }}
          />
        )}
        expandIconPosition="end"
        style={{
          background: "white",
          boxShadow: "0 0 2px black",
          padding: 0,
        }}
        items={items}
      />
    </>
  );
}

function Tables(item) {
  const columns = [
    {
      title: "COMPANY NAME",
      dataIndex: "nomEntreprise",
      key: "nomEntreprise",
    },
    {
      title: "HEADQUARTERS LOCATION",
      dataIndex: "emplacementSiegeSocial",
      key: "emplacementSiegeSocial",
    },
  ];
  const rows = item.map((items, index) => ({
    key: index,
    nomEntreprise: items.nomEntreprise,
    emplacementSiegeSocial: items.emplacementSiegeSocial,
  }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#2b2b2b",
            headerColor: "white",
            rowHoverBg: "#fff",
          },
        },
      }}
    >
      <Table
        dataSource={rows}
        columns={columns}
        pagination={false}
        size="small"
        showHeader={false}
      />
    </ConfigProvider>
  );
}

export default ApprovedList;
