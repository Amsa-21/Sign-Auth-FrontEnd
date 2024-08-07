import axios from "axios";
import { FilePdfTwoTone, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  List,
  Typography,
  message,
  Upload,
  Progress,
  Divider,
  Result,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Analysis() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
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

      const response = await axios.post(`${API_URL}/getPDFInfo`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      message.success("Successfully upload");
      console.log(response);
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
    <>
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <FilePdfTwoTone />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload a PDF
        </p>
        <p className="ant-upload-hint">Support for a single PDF upload.</p>
      </Upload.Dragger>
      {fileInfo && (
        <Typography.Text code>
          {fileInfo.name}
          <Divider type="vertical" />
          {getFileSize(fileInfo.size)}
          <Divider type="vertical" />
          {fileInfo && fileInfo.lastModifiedDate
            ? fileInfo.lastModifiedDate.toLocaleDateString() +
              " " +
              fileInfo.lastModifiedDate.toLocaleTimeString()
            : "No date available"}
        </Typography.Text>
      )}
      {uploadProgress && (
        <Progress
          showInfo={false}
          percent={uploadProgress}
          status={uploading ? "active" : ""}
        />
      )}
      {!data.isEmpty
        ? data.result && (
            <>
              <Divider />
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
            <>
              <Divider />
              <Typography.Text strong style={{ color: "red" }}>
                No Signature found in this file!
              </Typography.Text>
            </>
          )}
    </>
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
