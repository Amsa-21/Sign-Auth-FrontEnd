import React, { useState } from "react";
import { FilePdfTwoTone, EyeOutlined } from "@ant-design/icons";
import { Typography, message, Upload, Divider, Spin, Modal } from "antd";
import axios from "axios";
import CertificateDetails from "./CertificateDetails";
import HomeLayout from "../../container";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Analysis() {
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);

  const handleFileUpload = async (file) => {
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
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error(`${file.name} n'est pas un fichier PDF`);
      }
      return isPdf || Upload.LIST_IGNORE;
    },
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

  return (
    <HomeLayout>
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
      <Typography.Title level={2}>Ajouter un document</Typography.Title>
      <div style={{ marginBottom: 10 }}>
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
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography.Text code style={{ width: "90%" }}>
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
            <Typography.Link underline onClick={() => setOpen(true)}>
              <EyeOutlined
                style={{ color: "rgb(0, 100, 200)", marginRight: 7 }}
              />
              Aperçu
            </Typography.Link>
          </div>
        )}
      </div>
      <Spin spinning={uploading} fullscreen></Spin>
      {data && !data.isEmpty ? (
        data.result && (
          <>
            <Divider />
            <CertificateDetails data={data.result} />
          </>
        )
      ) : (
        <>
          <Divider />
          <Typography.Title level={5} style={{ color: "red" }}>
            No Signature found in this file !
          </Typography.Title>
        </>
      )}
    </HomeLayout>
  );
}

export default Analysis;
