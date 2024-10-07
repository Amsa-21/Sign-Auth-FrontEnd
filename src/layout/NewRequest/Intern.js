import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Upload,
  Typography,
  message,
  Button,
  Select,
  Input,
  notification,
  ConfigProvider,
  Tooltip,
} from "antd";
import { FilePdfFilled, EyeFilled } from "@ant-design/icons";
import axios from "axios";
import ModalPDF from "../component/ModalPDF";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Intern() {
  document.getElementById("title").innerHTML = "Nouvelle demande - Mandarga";

  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState([]);
  const [signers, setSigners] = useState([]);
  const [object, setObject] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const person =
    sessionStorage.getItem("username") +
    " " +
    sessionStorage.getItem("telephone");

  const clearLocalStorage = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("telephone");
    sessionStorage.removeItem("role");
  };

  const handleSubmit = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    let refreshToken = Boolean(sessionStorage.getItem("refreshToken"));
    if (refreshToken) {
      refreshToken = sessionStorage.getItem("refreshToken");
    }
    if (fileInfo === null) {
      message.warning("Aucun document n'est téléchargé !");
      return;
    } else if (signers.length === 0) {
      message.warning("Aucun signataire n'est choisi !");
      return;
    } else if (object.trim() === "" || comment.trim() === "") {
      message.warning("Veuillez renseigner l'objet et le commentaire !");
      return;
    } else {
      const formData = new FormData();
      formData.append("fichier", fileInfo);
      formData.append("demandeur", person);
      formData.append("signataires", signers);
      formData.append("objet", object);
      formData.append("commentaire", comment);
      try {
        setUploading(true);

        const response = await axios.post(`${API_URL}/addRequest`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          message.success("Demande créée avec succès !");
          navigate("/");
        } else {
          notification.error({
            message: response.data.error,
            placement: "bottomRight",
            duration: 5,
          });
        }
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
              `${API_URL}/addRequest`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );

            if (retryResponse.data.success) {
              message.success("Demande créée avec succès !");
              navigate("/");
            } else {
              notification.error({
                message: retryResponse.data.error,
                placement: "bottomRight",
                duration: 5,
              });
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
        } else if (error.response.status === 401) {
          clearLocalStorage();
          navigate("/login");
        } else {
          console.error(error);
          message.error(error.message);
        }
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
      const accessToken = sessionStorage.getItem("accessToken");
      let refreshToken = Boolean(sessionStorage.getItem("refreshToken"));
      if (refreshToken) {
        refreshToken = sessionStorage.getItem("refreshToken");
      }

      try {
        const response = await axios.get(`${API_URL}/allUsers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.result);
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

            const retryResponse = await axios.get(`${API_URL}/allUsers`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            setData(retryResponse.data.result);
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
          console.error("Erreur lors de la récupération des données :", error);
          message.error(error.message);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (value) => {
    setSigners(value);
  };

  let options = data.map((item, _) => ({
    label: item.prenom + " " + item.nom + " [" + item.email + "]",
    value: item.prenom + " " + item.nom + " " + item.telephone,
    tel: item.telephone,
  }));

  options = options.filter(
    (element) => element.tel !== sessionStorage.getItem("telephone")
  );

  return (
    <>
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
                <EyeFilled style={{ color: "rgb(90,56,39)", marginRight: 7 }} />
                Aperçu
              </Typography.Link>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Select
            mode="multiple"
            size="middle"
            maxCount={12}
            placeholder="Choisir un ou plusieurs signataire(s)"
            onChange={handleChange}
            style={{ width: "100%" }}
            options={options}
            optionRender={(option) => option.data.label}
            maxTagCount="responsive"
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                overlayStyle={{
                  pointerEvents: "none",
                }}
                title={omittedValues.map(({ label }) => label).join(", ")}>
                <span>Voir plus</span>
              </Tooltip>
            )}
          />
          <Input
            placeholder="Objet de la demande"
            size="middle"
            onChange={(e) => setObject(e.target.value)}
            style={{ width: "100%" }}
          />
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            size="middle"
            placeholder="Commentaire à propos de la demande"
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBlock: 30,
          }}>
          <Button
            onClick={handleSubmit}
            style={{ height: 40, width: 125 }}
            loading={uploading}>
            <span
              style={{
                fontFamily: "Arial, Helvetica, sans-serif",
                fontWeight: "bold",
                fontSize: 14,
              }}>
              Créer
            </span>
          </Button>
        </div>
      </ConfigProvider>
    </>
  );
}

export default Intern;
