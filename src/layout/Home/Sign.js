import React, { useState } from "react";
import axios from "axios";
import {
  message,
  Divider,
  Upload,
  Spin,
  Typography,
  Button,
  Form,
  Input,
} from "antd";
import { FilePdfTwoTone } from "@ant-design/icons";
import { Viewer } from "@react-pdf-viewer/core";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Sign() {
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const handleFileUpload = async (values) => {
    if (uploading) return;
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("fichier", fileInfo);
      formData.append("user", person);
      formData.append("code", values.code);

      const response = await axios.post(`${API_URL}/signPDF`, formData, {});
      if (response.data.success) {
        message.success("Successfully signed !");
        console.log(response);
        setPdfURL(URL.createObjectURL(base64toBlob(response.data.pdfdata)));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const base64toBlob = (data) => {
    const bytes = atob(data);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: "application/pdf" });
  };

  const props = {
    name: "file",
    multiple: false,
    accept: ".pdf",
    customRequest: (options) => {
      const { file } = options;
      setFileInfo(file);
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
    <>
      <Spin spinning={uploading} fullscreen></Spin>
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
      <div>
        <Form style={{ marginTop: 30 }} onFinish={handleFileUpload}>
          <Form.Item
            hasFeedback
            label={"Code Secret"}
            name="code"
            rules={[
              {
                required: true,
                message: "Veuiller entrer votre code secret !",
              },
            ]}
          >
            <Input.OTP length={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Signer
            </Button>
          </Form.Item>
        </Form>
      </div>
      {pdfURL && (
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "750px",
          }}
        >
          <Viewer fileUrl={pdfURL} />
        </div>
      )}
    </>
  );
}

export default Sign;
