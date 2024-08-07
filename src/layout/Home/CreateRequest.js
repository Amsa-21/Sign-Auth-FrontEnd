import React, { useState, useEffect } from "react";
import {
  Divider,
  Upload,
  Typography,
  message,
  Button,
  Select,
  Space,
  Input,
  notification,
} from "antd";
import { FilePdfTwoTone } from "@ant-design/icons";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function CreateRequest() {
  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState([]);
  const [signers, setSigners] = useState([]);
  const [object, setObject] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const handleSubmit = async () => {
    if (uploading) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("fichier", fileInfo);
      formData.append("demandeur", person);
      formData.append("signataires", signers);
      formData.append("objet", object);
      formData.append("commentaire", comment);
      const response = await axios.post(`${API_URL}/addRequest`, formData, {});
      if (response.data.success) {
        message.success("Demande envoyer avec succès !");
        window.location.reload();
      } else {
        notification.error({
          message: response.data.error,
          placement: "bottomRight",
          duration: 5,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/allUsers`);
        setData(response.data.result);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        message.error(error.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (value) => {
    setSigners(value);
  };

  let options = data.map((item, _) => ({
    label: item.prenom + " " + item.nom + " [" + item.email + "]",
    value: item.prenom + " " + item.nom + " " + item.telephone,
    tel: item.telephone,
  }));

  options = options.filter(
    (element) => element.tel !== localStorage.getItem("telephone")
  );

  return (
    <div>
      <Typography.Title level={2}>Ajouter un document</Typography.Title>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
      >
        <div style={{ width: "50%", height: 185 }}>
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
        </div>
        {fileInfo && (
          <div style={{ width: "50%" }}>
            <embed
              type="application/pdf"
              src={URL.createObjectURL(fileInfo)}
              width={"100%"}
              height={370}
            />
          </div>
        )}
      </div>
      <Divider />
      <Typography.Title level={2}>Choisir les signataires</Typography.Title>
      <div>
        <Select
          mode="multiple"
          size="middle"
          placeholder="Choisir un ou plusieurs signataire(s)"
          style={{ width: "50%", border: "1px solid rgba(7, 33, 66, 0.5)" }}
          onChange={handleChange}
          options={options}
          optionRender={(option) => <Space>{option.data.label}</Space>}
        />
      </div>
      <Divider />
      <Typography.Title level={2}>
        Ajouter un objet et un commentaire
      </Typography.Title>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 20 }}
      >
        <div style={{ width: "30%" }}>
          <Input
            placeholder="Objet de la demande"
            size="middle"
            onChange={(e) => setObject(e.target.value)}
            style={{ border: "1px solid rgba(7, 33, 66, 0.5)" }}
          />
        </div>
        <div style={{ width: "70%" }}>
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            size="middle"
            placeholder="Commentaire à propos de la demande"
            onChange={(e) => setComment(e.target.value)}
            style={{ border: "1px solid rgba(7, 33, 66, 0.5)" }}
          />
        </div>
      </div>
      <Divider />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ backgroundColor: "#072142" }}
          onClick={handleSubmit}
          loading={uploading}
        >
          <Typography.Text strong style={{ color: "white" }}>
            Enregistrer
          </Typography.Text>
        </Button>
      </div>
    </div>
  );
}

export default CreateRequest;
