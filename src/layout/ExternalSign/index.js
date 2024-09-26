import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  Dropdown,
  Spin,
  Divider,
  Modal,
  Button,
  message,
  notification,
  ConfigProvider,
  Popconfirm,
  Result,
  Skeleton,
} from "antd";
import {
  UserOutlined,
  CaretDownOutlined,
  UserAddOutlined,
  SignatureOutlined,
  CloseOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "../../container/Sidenav/index.css";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_URL = process.env.REACT_APP_API_BASE_URL;

function ExternalSign() {
  document.getElementById("title").innerHTML = "Signature externe - Mandarga";

  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const { name } = useParams();
  const { doc } = useParams();
  const { refreshToken } = useParams();
  const [nom, setNom] = useState("");
  const [open, setOpen] = useState(false);
  const [dataPDF, setDataPDF] = useState("");
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opencap, setOpencap] = useState(false);
  const [finish, setFinish] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const params = new URLSearchParams({
          filename: doc,
        }).toString();
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
          `${API_URL}/getExtPDF?${params}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
        if (retryResponse.data.success) {
          setDataPDF(retryResponse.data.result);
        } else {
          message.error(retryResponse.data.error);
        }
      } catch (refreshError) {
        if (refreshError.response && refreshError.response.status === 401) {
          setFinish(2);
        }
      } finally {
        setLoad(false);
      }
    };
    fetchData();
  }, [doc, refreshToken]);

  const capture = async () => {
    try {
      setLoading(true);
      await handleSignPDF(webcamRef.current.getScreenshot());
    } catch (error) {
      console.error(error);
      message.error(error.toString());
    } finally {
      setLoading(false);
      setOpencap(false);
    }
  };

  const handleSignPDF = async (img) => {
    try {
      setLoad(true);
      const formData = new FormData();
      formData.append("user", name);
      formData.append("filename", doc);
      formData.append("image", img);
      const access_token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_URL}/externalSignPDF`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.data.success) {
        setFinish(1);
      } else {
        notification.error({
          message: response.data.error,
          placement: "bottomRight",
          duration: 5,
        });
        setOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la signature du PDF :", error);
      if (error.response && error.response.status === 401) {
        message.error("Votre session a expiré. Veuillez recharger la page.");
      } else {
        message.error(
          "Une erreur s'est produite lors de la signature du PDF. Veuillez réessayer."
        );
      }
    } finally {
      setLoad(false);
    }
  };

  const handleRefuse = async () => {
    const params = new URLSearchParams({
      filename: doc,
    }).toString();
    try {
      setLoad(true);
      let access_token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${API_URL}/refuseExtRequest?${params}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.data.success) {
        setFinish(1);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error("Erreur lors du refus de la demande :", error);
      if (error.response && error.response.status === 401) {
        message.error("Votre session a expiré. Veuillez recharger la page.");
      } else {
        message.error(
          "Une erreur s'est produite. Veuillez réessayer plus tard."
        );
      }
    } finally {
      setLoad(false);
    }
  };

  const items = [
    {
      label: "Créer un compte",
      key: "1",
      icon: <UserAddOutlined />,
      onClick: () => navigate("/subscription"),
    },
  ];

  useEffect(() => {
    setNom(
      name
        .split("_")
        .slice(0, -1)
        .map((elem) => elem)
        .join(" ")
    );
  }, [name, doc]);

  const base64toBlob = (string) => {
    const bytes = atob(string);
    let length = bytes.length;
    let out = new Uint8Array(length);
    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }
    return new Blob([out], { type: "application/pdf" });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          backgroundColor: "#2B2B2B",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 20,
        }}>
        <Typography.Text
          style={{
            display: "flex",
            height: "64px",
            alignItems: "center",
          }}>
          <h2 style={{ color: "white", marginTop: 15 }}>Mandarga</h2>
        </Typography.Text>
        <div
          style={{
            display: "flex",
            height: "fit-content",
            color: "white",
            gap: 10,
          }}>
          <UserOutlined style={{ fontSize: 18, color: "white" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}>
            <>
              <Typography.Text style={{ fontSize: 16, color: "white" }}>
                Bienvenue, {nom}
              </Typography.Text>
              <Typography.Text
                italic={true}
                style={{ fontSize: 12, color: "#8A8A8A" }}>
                Utilisateur externe
              </Typography.Text>
            </>
          </div>
          <Dropdown
            menu={{
              items,
            }}
            onOpenChange={() => setOpen(!open)}>
            <CaretDownOutlined
              rotate={open ? 180 : 0}
              style={{
                fontSize: 18,
                color: "white",
              }}
            />
          </Dropdown>
        </div>
      </Layout.Header>
      <Spin fullscreen spinning={load} />
      <Modal
        open={opencap}
        title="Capture du visage"
        footer={
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
              onClick={capture}
              loading={loading}
              style={{ height: 40, fontSize: 14 }}>
              Prendre la photo
            </Button>
          </ConfigProvider>
        }
        onCancel={() => {
          setOpencap(false);
        }}
        destroyOnClose={true}
        width={688}
        height={520}>
        <Divider />
        {!loading ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            minScreenshotWidth={200}
            minScreenshotHeight={200}
            mirrored={true}
            style={{ borderRadius: "6px" }}
          />
        ) : (
          <Skeleton.Image active={loading} />
        )}
      </Modal>
      <Layout.Content
        style={{
          display: "flex",
          overflow: "auto",
          justifyContent: "center",
          backgroundColor: "#F5F1E9",
        }}>
        {finish === 0 ? (
          <div
            style={{
              display: "flex",
              padding: 20,
            }}>
            {dataPDF && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 7,
                  width: 820,
                }}>
                <Typography.Text style={{ marginBottom: 20 }} strong>
                  {doc}
                </Typography.Text>
                <embed
                  type="application/pdf"
                  src={URL.createObjectURL(base64toBlob(dataPDF))}
                  width="100%"
                  height="100%"
                  style={{ borderRadius: 7, boxShadow: "0 0 2px black" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 50,
                    marginTop: 20,
                  }}>
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
                      icon={<SignatureOutlined />}
                      onClick={() => setOpencap(true)}
                      style={{ width: 150, height: 40, fontSize: 16 }}>
                      Signer
                    </Button>
                  </ConfigProvider>
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          defaultBg: "#fff",
                          defaultHoverBg: "#5A3827",
                          defaultColor: "#5A3827",
                          defaultHoverColor: "#fff",
                          defaultHoverBorderColor: "#5A3827",
                          defaultBorderColor: "#5A3827",
                          defaultActiveColor: "#fff",
                          defaultActiveBg: "#8a8a8a",
                          defaultActiveBorderColor: "#fff",
                        },
                      },
                    }}>
                    <Popconfirm
                      placement="topLeft"
                      title="Voulez-vous vraiment rejeter cette demande ?"
                      description="Rejeter le demande"
                      okText="Oui"
                      cancelText="Non"
                      onConfirm={() => handleRefuse()}>
                      <Button
                        type="default"
                        icon={<CloseOutlined />}
                        style={{ width: 150, height: 40, fontSize: 16 }}>
                        Rejeter
                      </Button>
                    </Popconfirm>
                  </ConfigProvider>
                </div>
              </div>
            )}
          </div>
        ) : finish === 1 ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                borderRadius: 7,
                padding: 20,
                justifyContent: "center",
                boxShadow: "0 0 2px black",
                width: 700,
              }}>
              <Result
                icon={<CheckCircleFilled style={{ color: "black" }} />}
                title="Action réussie"
                subTitle={`L'opération sur ${doc} a été effectuée avec succès.`}
                extra={[
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
                      onClick={() => navigate("/subscription")}>
                      Créer un compte
                    </Button>
                  </ConfigProvider>,
                ]}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "white",
                borderRadius: 7,
                padding: 20,
                justifyContent: "center",
                boxShadow: "0 0 2px black",
                width: 700,
              }}>
              <Result
                status="403"
                title="Page expirée"
                subTitle="L'accès à cette page n'est plus autorisé. 
                Le lien a probablement expiré ou le traitement du document a déjà été effectué."
                extra={[
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
                      style={{ height: 40 }}
                      onClick={() => navigate("/subscription")}>
                      Créer un compte
                    </Button>
                  </ConfigProvider>,
                ]}
              />
            </div>
          </div>
        )}
      </Layout.Content>
    </Layout>
  );
}

export default ExternalSign;
