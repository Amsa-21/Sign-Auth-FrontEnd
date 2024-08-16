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
  Modal,
  ConfigProvider,
} from "antd";
import HomeLayout from "../../container";
import { FilePdfFilled, EyeOutlined } from "@ant-design/icons";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function NewRequest() {
  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState([]);
  const [signers, setSigners] = useState([]);
  const [object, setObject] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const handleSubmit = async () => {
    if (fileInfo === null) {
      message.warning("Aucun document n'est téléchargé !");
    } else if (signers.length === 0) {
      message.warning("Aucun signataire n'est choisi !");
    } else if (object.trim() === "" || comment.trim() === "") {
      message.warning("Les champs Objet ou Commentaire sont vides !");
    } else {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("fichier", fileInfo);
        formData.append("demandeur", person);
        formData.append("signataires", signers);
        formData.append("objet", object);
        formData.append("commentaire", comment);
        const response = await axios.post(
          `${API_URL}/addRequest`,
          formData,
          {}
        );
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
        <div style={{ display: "flex" }}>
          {fileInfo && (
            <embed
              type="application/pdf"
              src={URL.createObjectURL(fileInfo)}
              width={"100%"}
              height={700}
            />
          )}
        </div>
      </Modal>
      <div style={{ paddingInline: "15%" }}>
        <ConfigProvider
          theme={{
            components: {
              Upload: {
                colorBorder: "#5A3827",
                colorPrimaryHover: "#8a8a8a",
                colorPrimary: "#5A3827",
              },
              Select: {
                colorBorder: "#5A3827",
                colorTextPlaceholder: "rgba(0, 0, 0, 0.75)",
                colorPrimaryHover: "#8a8a8a",
                colorPrimary: "#5A3827",
              },
              Input: {
                colorBorder: "#5A3827",
                colorTextPlaceholder: "rgba(0, 0, 0, 0.75)",
                colorPrimaryHover: "#8a8a8a",
                colorPrimary: "#5A3827",
              },
              Button: {
                defaultBg: "#5A3827",
                defaultHoverBg: "#fff",
                defaultColor: "#fff",
                defaultHoverColor: "#5A3827",
                defaultHoverBorderColor: "#5A3827",
                defaultBorderColor: "#5A3827",
                defaultActiveColor: "#5A3827",
                defaultActiveBg: "#8a8a8a",
                defaultActiveBorderColor: "#5A3827",
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
            <div style={{ alignSelf: "center", width: 300 }}>
              <Upload.Dragger
                {...props}
                style={{ backgroundColor: "rgba(100, 100, 100, 0.2" }}
              >
                <Typography.Title level={4}>
                  Importer votre fichier PDF
                </Typography.Title>
                <FilePdfFilled style={{ fontSize: 25 }} />
                <p className="ant-upload-hint">
                  Prise en charge d'un seul téléchargement de PDF.
                </p>
              </Upload.Dragger>
            </div>
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
                <Typography.Link underline onClick={() => setOpen(true)}>
                  <EyeOutlined
                    style={{ color: "rgb(0, 100, 200)", marginRight: 7 }}
                  />
                  Aperçu
                </Typography.Link>
              </div>
            )}
          </div>
          <Divider />

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <Select
                mode="multiple"
                size="middle"
                maxCount={12}
                placeholder="Choisir un ou plusieurs signataire(s)"
                onChange={handleChange}
                style={{ width: "50%" }}
                options={options}
                optionRender={(option) => <Space>{option.data.label}</Space>}
              />
              <Input
                placeholder="Objet de la demande"
                size="middle"
                onChange={(e) => setObject(e.target.value)}
                style={{ width: "50%" }}
              />
            </div>
            <div style={{ display: "flex" }}>
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 6 }}
                size="middle"
                placeholder="Commentaire à propos de la demande"
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <Divider />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleSubmit} loading={uploading}>
              Enregistrer
            </Button>
          </div>
        </ConfigProvider>
      </div>
    </HomeLayout>
  );
}

export default NewRequest;
