import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Upload,
  Typography,
  message,
  Button,
  Input,
  notification,
  Modal,
  ConfigProvider,
} from "antd";
import { FilePdfFilled, EyeFilled } from "@ant-design/icons";
import axios from "axios";
import ModalPDF from "../component/ModalPDF";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Extern() {
  document.getElementById("title").innerHTML = "Nouvelle demande - Mandarga";

  const [fileInfo, setFileInfo] = useState(null);
  const [extSigners, setExtSigners] = useState([]);
  const [object, setObject] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
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
    } else if (
      prenom.trim() === "" ||
      nom.trim() === "" ||
      email.trim() === ""
    ) {
      message.warning(
        "Veuillez renseigner le prénom, le nom et l'email du destinataire !"
      );
      return;
    } else if (object.trim() === "" || comment.trim() === "") {
      message.warning("Veuillez renseigner l'objet et le commentaire !");
      return;
    } else {
      const formData = new FormData();
      formData.append("fichier", fileInfo);
      formData.append("demandeur", person);
      formData.append(
        "signataires",
        extSigners
          .map(
            (elem) =>
              `${elem.prenom.charAt(0).toUpperCase()}${elem.prenom.slice(
                1
              )} ${elem.nom.toUpperCase()} ${elem.email
                .charAt(0)
                .toUpperCase()}${elem.email.slice(1)}`
          )
          .join(", ")
      );
      formData.append("objet", object);
      formData.append("commentaire", comment);
      try {
        setUploading(true);
        const response = await axios.post(
          `${API_URL}/addExternalRequest`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

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
              `${API_URL}/addExternalRequest`,
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
          <Modal
            centered
            open={open1}
            title="Information du destinataire"
            footer={
              <Button
                style={{ marginBlockStart: 8, height: 40, width: 125 }}
                onClick={() => {
                  if (prenom === "" || nom === "" || email === "") {
                    message.warning(
                      "Veuillez remplir toutes les informations !"
                    );
                  } else if (extSigners.length === 12) {
                    message.warning(
                      "Le nombre de signature maximal est atteint !"
                    );
                  } else {
                    const isDuplicate = extSigners.some(
                      (signer) =>
                        signer.email.trim().toLowerCase() ===
                        email.trim().toLowerCase()
                    );
                    if (!isDuplicate) {
                      setExtSigners([
                        ...extSigners,
                        {
                          prenom: prenom,
                          nom: nom.toUpperCase(),
                          email: email,
                        },
                      ]);
                      message.success("Utilisateur ajouté avec succès !");
                      setOpen1(false);
                    } else {
                      message.warning(
                        "Cet email est déjà ajouté comme destinataire !"
                      );
                    }
                  }
                }}>
                Ajouter
              </Button>
            }
            onCancel={() => {
              setOpen1(false);
            }}
            destroyOnClose={true}>
            <Divider />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Input
                  placeholder="Prénom"
                  size="middle"
                  onChange={(e) => setPrenom(e.target.value)}
                  style={{ width: "50%" }}
                />
                <Input
                  placeholder="Nom"
                  size="middle"
                  onChange={(e) => setNom(e.target.value)}
                  style={{ width: "50%" }}
                />
              </div>
              <Input
                placeholder="Email"
                size="middle"
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </Modal>
          <ConfigProvider
            theme={{
              components: {
                Input: { borderRadius: "6px 0 0 6px" },
                Button: { borderRadius: "0 6px 6px 0" },
              },
            }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Input
                placeholder="Ajouter un ou plusieurs signataire(s) externe(s)"
                size="middle"
                readOnly
                value={extSigners
                  .map((elem) => `${elem.prenom} ${elem.nom} [${elem.email}]`)
                  .join(", ")}
                style={{ width: "100%" }}
              />
              <Button onClick={() => setOpen1(true)}>
                <span
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}>
                  +
                </span>
              </Button>
            </div>
          </ConfigProvider>
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

export default Extern;
