import PropTypes from "prop-types";
import { CaretRightOutlined } from "@ant-design/icons";
import { theme, Collapse, Typography, Table } from "antd";

function TablesCerts(datas) {
  const columns = [
    {
      title: "Attibut",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];
  const dataSource = Object.entries(datas).map(([key, value]) => ({
    key: key,
    value: value,
  }));

  return <Table dataSource={dataSource} columns={columns} pagination />;
}

function CertificateDetails({ certificates }) {
  const items = [];
  const { token } = theme.useToken();
  const panelStyle = {
    background: "#0C356A",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  Object.entries(certificates).map(([keys, values]) =>
    items.push({
      key: keys,
      label: (
        <Typography.Text strong style={{ color: "white" }}>
          {keys}
        </Typography.Text>
      ),
      children: TablesCerts(values),
      style: panelStyle,
    })
  );

  return (
    <Collapse
      accordion={true}
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined
          style={{ color: "white" }}
          rotate={isActive ? 90 : 0}
        />
      )}
      expandIconPosition="end"
      style={{
        background: "#0C356A",
      }}
      items={items}
    />
  );
}

CertificateDetails.propTypes = {
  certificates: PropTypes.object.isRequired,
};

export default CertificateDetails;
