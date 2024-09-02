import axios from "axios";
import {
  FilePdfFilled,
  EyeFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import {
  Button,
  List,
  Typography,
  message,
  Upload,
  ConfigProvider,
  Divider,
  Result,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPDF from "../component/ModalPDF";

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

  const handleAdd = async (values) => {
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("member", JSON.stringify(values));
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/addMemberFromAnalysis`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        message.success("Add successful");
        console.log(response.data);
        navigate(0);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshResponse = await axios.post(
          `${API_URL}/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        try {
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.post(
            `${API_URL}/addMemberFromAnalysis`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (retryResponse.data.success) {
            message.success("Add successful");
            console.log(retryResponse.data);
            navigate(0);
          } else {
            message.error(retryResponse.data.error);
          }
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token :",
            refreshError
          );
          message.error(
            "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
          );
        }
      } else {
        console.error("Erreur lors de l'ajout :", error);
        message.error("Add failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (uploading) return;

    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("fichier", file);
    try {
      setUploading(true);
      const response = await axios.post(`${API_URL}/getPDFInfo`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      message.success("Successfully uploaded");
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(
            `${API_URL}/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.post(
            `${API_URL}/getPDFInfo`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          message.success("Successfully uploaded");
          setData(retryResponse.data);
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token :",
            refreshError
          );
          message.error(
            "Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter."
          );
        }
      } else {
        console.error("Erreur lors du téléchargement du fichier :", error);
        message.error(error.message);
      }
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}>
      <ModalPDF
        open={open}
        onClose={() => setOpen(false)}
        content={
          fileInfo && (
            <div
              style={{
                display: "flex",
              }}>
              <embed
                type="application/pdf"
                src={URL.createObjectURL(fileInfo)}
                width="100%"
                height="900px"
                style={{
                  borderRadius: "7px",
                  boxShadow: "0 0 2px black",
                }}
              />
            </div>
          )
        }
      />
      <ConfigProvider
        theme={{
          components: {
            Upload: {
              colorBorder: "#5A3827",
              colorPrimaryHover: "#8a8a8a",
              colorPrimary: "#5A3827",
            },
          },
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: 10,
          }}>
          <Upload.Dragger
            {...props}
            style={{
              backgroundColor: "rgba(100, 100, 100, 0.2",
            }}>
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
              }}>
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
                onClick={() => setOpen(true)}>
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
                  icon={<CheckCircleFilled style={{ color: "black" }} />}
                  title="L'autorité de certification est reconnue !"
                  subTitle={ListComponentKnown(data.correlation)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 6,
                    boxShadow: "0 0 2px black",
                  }}
                />
              ) : (
                <Result
                  icon={<WarningFilled style={{ color: "black" }} />}
                  title="L'autorité de certification n'est pas reconnu!"
                  subTitle={ListComponent(data.result)}
                  extra={
                    <ConfigProvider
                      theme={{
                        components: {
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
                      }}>
                      <Button
                        type="default"
                        key="console"
                        loading={loading}
                        onClick={() => handleAdd(data.result)}>
                        Ajouter à ma propre liste de confiance approuvée
                      </Button>
                    </ConfigProvider>
                  }
                  style={{
                    backgroundColor: "white",
                    borderRadius: 6,
                    boxShadow: "0 0 2px black",
                  }}
                />
              )}
            </>
          )
        : data.result && (
            <Result
              title="Ce document ne contient pas de signatures électroniques."
              subTitle="Aprés l'analyse du document, nous n'avons trouvé aucune signature dans ce document PDF."
              icon={<CloseCircleFilled style={{ color: "black" }} />}
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
      bordered={false}
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
      bordered={false}
      size="small"
    />
  );
}

export default Analysis;
