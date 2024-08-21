import axios from "axios";
import {
  FilePdfFilled,
  EyeFilled,
  PlusOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  List,
  Typography,
  message,
  Upload,
  Modal,
  ConfigProvider,
  Divider,
  Result,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Analysis() {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    isEmpty: true,
    result: null,
    correlation: {},
  });

  const handleFileUpload = async (file) => {
    if (uploading) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("fichier", file);

      const response = await axios.post(`${API_URL}/getPDFInfo`, formData, {});
      message.success("Successfully upload");
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const props = {
    name: "file",
    multiple: false,
    accept: ".pdf",
    customRequest: (options) => {
      const { file } = options;
      setFileInfo(file);
      handleFileUpload(file);
    },
    showUploadList: false,
  };

  const getFileSize = (file_size) => {
    if (file_size / 1024 >= 1024) {
      file_size = parseFloat(file_size / 1024 / 1024).toFixed(2) + " MB";
    } else {
      file_size = parseFloat(file_size / 1024).toFixed(2) + " KB";
    }
    return file_size;
  };

  const handleAdd = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("member", JSON.stringify(values));
      const response = await axios.post(
        `${API_URL}/addMemberFromAnalysis`,
        formData,
        {}
      );

      if (response.data.success) {
        message.success("Add successful");
        console.log(response.data);
        navigate(0);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error("Add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <Modal
        open={open}
        title="Aperçu du Document"
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
        width={"90%"}
      >
        <Divider />
        {fileInfo && (
          <div style={{ display: "flex" }}>
            <embed
              type="application/pdf"
              src={URL.createObjectURL(fileInfo)}
              width={"100%"}
              height={700}
            />
          </div>
        )}
      </Modal>
      <ConfigProvider
        theme={{
          components: {
            Upload: {
              colorBorder: "#5A3827",
              colorPrimaryHover: "#8a8a8a",
              colorPrimary: "#5A3827",
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Upload.Dragger
            {...props}
            style={{
              backgroundColor: "rgba(100, 100, 100, 0.2",
            }}
          >
            <Typography.Title level={4}>
              Importer votre fichier PDF
            </Typography.Title>
            <FilePdfFilled style={{ fontSize: 25 }} />
            <p className="ant-upload-hint">
              Prise en charge d'un seul téléchargement de PDF.
            </p>
          </Upload.Dragger>
          {fileInfo && (
            <div
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography.Text code>
                {fileInfo.name}
                <Divider type="vertical" />
                {getFileSize(fileInfo.size)}
                <Divider type="vertical" />
                {fileInfo.lastModifiedDate
                  ? fileInfo.lastModifiedDate.toLocaleDateString() +
                    " " +
                    fileInfo.lastModifiedDate.toLocaleTimeString()
                  : "No date available"}
              </Typography.Text>
              <Typography.Link
                underline
                style={{ color: "rgb(90,56,39)" }}
                onClick={() => setOpen(true)}
              >
                <EyeFilled style={{ color: "rgb(90,56,39)", marginRight: 7 }} />
                Aperçu
              </Typography.Link>
            </div>
          )}
        </div>
      </ConfigProvider>
      {!data.isEmpty
        ? data.result && (
            <>
              {Object.keys(data.correlation).length !== 0 ? (
                <Result
                  status="success"
                  title="The certificate Issuer is known!"
                  subTitle={ListComponentKnown(data.correlation)}
                />
              ) : (
                <Result
                  status="warning"
                  title="The certificate Issuer is not known!"
                  subTitle={ListComponent(data.result)}
                  extra={
                    <Button
                      type="default"
                      key="console"
                      loading={loading}
                      onClick={() => handleAdd(data.result)}
                      style={{ backgroundColor: "#072142" }}
                      icon={<PlusOutlined style={{ color: "white" }} />}
                    >
                      <Typography.Text strong style={{ color: "white" }}>
                        Add to Own Approved Trust List
                      </Typography.Text>
                    </Button>
                  }
                />
              )}
            </>
          )
        : data.result && (
            <Result
              title="Ce document ne contient pas de signatures électroniques."
              subTitle="Aprés l'analyse du document, nous n'avons trouvé aucune signature dans ce document PDF."
              icon={<CloseCircleFilled style={{ color: "#5A3827" }} />}
              style={{
                backgroundColor: "white",
                borderRadius: 6,
                boxShadow: "0 0 2px black",
              }}
            />
          )}
    </div>
  );
}

function ListComponentKnown(data) {
  const filteredData = Object.entries(data).filter(
    ([key, _]) =>
      key === "codePaysRegion" ||
      key === "emplacementSiegeSocial" ||
      key === "nomEntreprise"
  );

  return (
    <List
      dataSource={filteredData}
      renderItem={([key, value]) => (
        <List.Item>
          <List.Item.Meta title={key} description={value} />
        </List.Item>
      )}
      bordered
      style={{
        backgroundColor: "rgb(240,242,245)",
        borderRadius: "10px",
      }}
      size="small"
    />
  );
}

function ListComponent(data) {
  return (
    <List
      dataSource={Object.entries(data)}
      renderItem={([key, value]) => (
        <List.Item>
          <List.Item.Meta title={key} description={value} />
        </List.Item>
      )}
      bordered
      style={{
        backgroundColor: "rgb(240,242,245)",
        borderRadius: "10px",
      }}
      size="small"
    />
  );
}

export default Analysis;
