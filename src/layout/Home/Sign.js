import React, { useState } from "react";
import axios from "axios";
import {
  message,
  Divider,
  Upload,
  Typography,
  Button,
  Form,
  Input,
  notification,
} from "antd";
import { FilePdfTwoTone } from "@ant-design/icons";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Sign() {
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const downloadPDF = (base64Data, fileName) => {
    const blob = base64ToBlob(base64Data, "application/pdf");
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
        downloadPDF(response.data.pdfdata, "signed_" + fileInfo.name);
      } else {
        notification.error({
          message: "Code invalid",
          description: "Le code secret que vous avez saisi est invalid.",
          placement: "bottomRight",
        });
      }
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

      {fileInfo && (
        <Form
          style={{ marginTop: 50 }}
          layout="vertical"
          onFinish={handleFileUpload}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Form.Item
              label={"Code Secret :"}
              name="code"
              rules={[
                {
                  required: true,
                  message: "Veuiller entrer votre code secret !",
                },
              ]}
            >
              <Input.OTP length={6} mask="🔒" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: 120, backgroundColor: "#072142" }}
                loading={uploading}
              >
                Signer
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
    </>
  );
}

export default Sign;
