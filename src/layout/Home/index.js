import React, { useState } from "react";
import HomeLayout from "../../container";
import { FilePdfTwoTone } from "@ant-design/icons";
import { Typography, message, Upload, Divider, Spin } from "antd";
import axios from "axios";
import CertificateDetails from "./CertificateDetails";
import SignCard from "./SignCard";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Home() {
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState({
    isEmpty: true,
    result: null,
    signature: null,
  });

  const handleFileUpload = async (file) => {
    setData({
      isEmpty: false,
      result: null,
      signature: null,
    });
    if (uploading) return;
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("fichier", file);

      const response = await axios.post(
        `${API_URL}/metadatafrompdf`,
        formData,
        {}
      );
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

  document.getElementById("title").innerHTML = "Home - Fraud Detection";

  return (
    <HomeLayout>
      <div>
        <Upload.Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <FilePdfTwoTone />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload a PDF
          </p>
          <p className="ant-upload-hint">Support for a single PDF upload.</p>
        </Upload.Dragger>
      </div>
      {fileInfo && (
        <Typography.Text code style={{ marginTop: "10px" }}>
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
      <Spin spinning={uploading} fullscreen></Spin>
      {!data.isEmpty
        ? data.result && (
            <>
              <Divider />
              <CertificateDetails certificates={data.result} />
            </>
          )
        : data.result && (
            <>
              <Divider />
              <Typography.Text strong style={{ color: "red" }}>
                No Signature found in this file !
              </Typography.Text>
            </>
          )}
      {data.signature && (
        <>
          <Divider />
          <SignCard sign={data.signature} />
        </>
      )}
    </HomeLayout>
  );
}

export default Home;
