import React, { useState, useEffect } from "react";
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
  Modal,
  ConfigProvider,
  Radio,
  Tooltip,
} from "antd";
import HomeLayout from "../../container";
import { FilePdfFilled, EyeFilled } from "@ant-design/icons";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function NewRequest() {
  document.getElementById("title").innerHTML = "Nouvelle demande - Mandarga";

  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState([]);
  const [signers, setSigners] = useState([]);
  const [extSigners, setExtSigners] = useState([]);
  const [object, setObject] = useState("");
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [value, setValue] = useState("interne");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const handleSubmit = async () => {
    if (fileInfo === null) {
      message.warning("Aucun document n'est téléchargé !");
      return;
    }
    if (value === "interne") {
      if (signers.length === 0) {
        message.warning("Aucun signataire n'est choisi !");
        return;
      } else if (object.trim() === "" || comment.trim() === "") {
        message.warning("Veuillez renseigner l'objet et le commentaire !");
        return;
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
          console.error(error);
          message.error(error.message);
        } finally {
          setUploading(false);
        }
      }
    } else {
      if (prenom.trim() === "" || nom.trim() === "" || email.trim() === "") {
        message.warning(
          "Veuillez renseigner le prénom, le nom et l'email du destinataire !"
        );
        return;
      } else if (object.trim() === "" || comment.trim() === "") {
        message.warning("Veuillez renseigner l'objet et le commentaire !");
        return;
      } else {
        try {
          setUploading(true);
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
          const response = await axios.post(
            `${API_URL}/addExternalRequest`,
            formData,
            {}
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
          console.error(error);
          message.error(error.message);
        } finally {
          setUploading(false);
        }
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
        title="Aperçu du document"
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 600 }}>
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
                Radio: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
                Checkbox: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
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
                  <Typography.Link
                    underline
                    style={{ color: "rgb(90,56,39)" }}
                    onClick={() => setOpen(true)}
                  >
                    <EyeFilled
                      style={{ color: "rgb(90,56,39)", marginRight: 7 }}
                    />
                    Aperçu
                  </Typography.Link>
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBlock: 30,
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <div style={{ width: 320 }}>
                <Radio.Group
                  defaultValue={value}
                  buttonStyle="solid"
                  onChange={(e) => {
                    setValue(e.target.value);
                    setExtSigners([]);
                  }}
                  style={{ width: "100%" }}
                >
                  <Radio.Button
                    value="interne"
                    style={{ width: "50%", textAlign: "center" }}
                  >
                    Demande interne
                  </Radio.Button>
                  <Radio.Button
                    value="externe"
                    style={{ width: "50%", textAlign: "center" }}
                  >
                    Demande externe
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              ></div>
            </div>
            {value === "interne" ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
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
                      title={omittedValues.map(({ label }) => label).join(", ")}
                    >
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
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <Modal
                  open={open1}
                  title="Information du destinataire"
                  footer={
                    <Button
                      style={{ marginBlockStart: 8 }}
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
                      }}
                    >
                      Ajouter
                    </Button>
                  }
                  onCancel={() => {
                    setOpen1(false);
                  }}
                  destroyOnClose={true}
                >
                  <Divider />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
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
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <Input
                      placeholder="Ajouter un ou plusieurs signataire(s) externe(s)"
                      size="middle"
                      readOnly
                      value={extSigners
                        .map(
                          (elem) => `${elem.prenom} ${elem.nom} [${elem.email}]`
                        )
                        .join(", ")}
                      style={{ width: "100%" }}
                    />
                    <Button onClick={() => setOpen1(true)}>
                      <span
                        style={{
                          fontFamily: "Arial, Helvetica, sans-serif",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
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
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBlock: 30,
              }}
            >
              <Button
                onClick={handleSubmit}
                style={{ height: 40, width: 125 }}
                loading={uploading}
              >
                <span
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Créer
                </span>
              </Button>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </HomeLayout>
  );
}

export default NewRequest;
