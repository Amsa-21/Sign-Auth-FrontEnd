import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FilePdfFilled, EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import {
  Typography,
  message,
  Upload,
  Divider,
  Spin,
  ConfigProvider,
  Result,
} from "antd";
import axios from "axios";
import CertificateDetails from "./CertificateDetails";
import HomeLayout from "../../container";
import ModalPDF from "../component/ModalPDF";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Analysis() {
  document.getElementById("title").innerHTML = "Vérification - Mandarga";
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const clearLocalStorage = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("telephone");
    sessionStorage.removeItem("role");
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "/login";
    }
  }, []);

  const handleFileUpload = async (file) => {
    if (uploading) return;
    const accessToken = sessionStorage.getItem("accessToken");
    let refreshToken = Boolean(sessionStorage.getItem("refreshToken"));
    if (refreshToken) {
      refreshToken = sessionStorage.getItem("refreshToken");
    }

    const formData = new FormData();
    formData.append("fichier", file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${API_URL}/metadatafrompdf`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401 && refreshToken) {
        try {
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
          sessionStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.post(
            `${API_URL}/metadatafrompdf`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );
          console.log(retryResponse.data);
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
      } else if (error.response.status === 401) {
        clearLocalStorage();
        navigate("/login");
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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}>
        <Spin spinning={uploading} fullscreen></Spin>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            width: 800,
          }}>
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
                style={{ backgroundColor: "rgba(100, 100, 100, 0.2" }}>
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
                    <EyeFilled
                      style={{ color: "rgb(90,56,39)", marginRight: 7 }}
                    />
                    Aperçu
                  </Typography.Link>
                </div>
              )}
            </div>
          </ConfigProvider>
          {data && (
            <>
              {!data.isEmpty ? (
                <CertificateDetails data={data.result} />
              ) : (
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
            </>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default Analysis;
