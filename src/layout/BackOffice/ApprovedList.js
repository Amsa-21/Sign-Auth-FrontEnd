import React, { useState, useEffect } from "react";
import axios from "axios";
import { CaretRightOutlined } from "@ant-design/icons";
import { Typography, theme, message, Collapse, Spin, Table } from "antd";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function ApprovedList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/data`);
        setData(response.data.result);
        console.log(response.data.result);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        message.error("Loading failed");
      }
      setLoading(false);
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
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 10,
    background: token.background,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  Object.entries(c).map(([codePaysRegion, item]) =>
    items.push({
      key: codePaysRegion,
      label: (
        <Typography.Text strong style={{ color: "#000" }}>
          {codePaysRegion}
        </Typography.Text>
      ),
      children: Tables(item),
      style: panelStyle,
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
          background: token.background,
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
    <Table columns={columns} dataSource={rows} size="small" bordered={false} />
  );
}

export default ApprovedList;
