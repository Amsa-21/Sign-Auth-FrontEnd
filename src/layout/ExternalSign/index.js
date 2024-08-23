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
} from "antd";
import {
  UserOutlined,
  CaretDownOutlined,
  UserAddOutlined,
  SignatureOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import "../../container/sidenav/index.css";

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
  const [nom, setNom] = useState("");
  const [open, setOpen] = useState(false);
  const [dataPDF, setDataPDF] = useState("");
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [opencap, setOpencap] = useState(false);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        const params = new URLSearchParams({
          filename: doc,
        }).toString();
        const response = await axios.post(`${API_URL}/getExtPDF?${params}`);

        if (response.data.success) {
          setDataPDF(response.data.result);
        }
      } catch (error) {
        console.error(error);
        message.error(error.message);
      } finally {
        setLoad(false);
      }
    };

    fetchData();
  }, [doc]);

  const capture = async () => {
    try {
      setLoading(true);
      handleSignPDF(webcamRef.current.getScreenshot());
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
      const response = await axios.post(
        `${API_URL}/externalSignPDF`,
        formData,
        {}
      );
      if (response.data.success) {
        setFinish(true);
      } else {
        notification.error({
          message: response.data.error,
          placement: "bottomRight",
          duration: 5,
        });
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setLoad(false);
    }
  };

  const handleRefuse = async () => {
    try {
      const params = new URLSearchParams({
        filename: doc,
      }).toString();
      const response = await axios.post(
        `${API_URL}/refuseExtRequest?${params}`
      );
      if (response.data.success) {
        setFinish(true);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
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
        }}
      >
        <Typography.Text
          style={{
            display: "flex",
            height: "64px",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "white", marginTop: 15 }}>Mandarga</h2>
        </Typography.Text>
        <div
          style={{
            display: "flex",
            height: "fit-content",
            color: "white",
            gap: 10,
          }}
        >
          <UserOutlined style={{ fontSize: 18, color: "white" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <>
              <Typography.Text style={{ fontSize: 16, color: "white" }}>
                Bienvenue, {nom}
              </Typography.Text>
              <Typography.Text
                italic={true}
                style={{ fontSize: 12, color: "#8A8A8A" }}
              >
                Utilisateur externe
              </Typography.Text>
            </>
          </div>
          <Dropdown
            menu={{
              items,
            }}
            onOpenChange={() => setOpen(!open)}
          >
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
            }}
          >
            <Button
              type="default"
              onClick={capture}
              loading={loading}
              style={{ width: 150, fontSize: 14 }}
            >
              Prendre la photo
            </Button>
          </ConfigProvider>
        }
        onCancel={() => {
          setOpencap(false);
        }}
        destroyOnClose={true}
        width={688}
        height={520}
      >
        <Divider />
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
      </Modal>
      <Layout.Content
        style={{
          display: "flex",
          overflow: "auto",
          backgroundColor: "#F5F1E9",
        }}
      >
        {!finish ? (
          <div style={{ display: "flex", padding: 20 }}>
            <div style={{ display: "flex", width: 400, marginRight: 20 }}>
              <Typography.Text strong>{doc}</Typography.Text>
            </div>
            {dataPDF && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 7,
                  width: 820,
                }}
              >
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
                  }}
                >
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
                    }}
                  >
                    <Button
                      type="default"
                      icon={<SignatureOutlined />}
                      onClick={() => setOpencap(true)}
                      style={{ width: 150, height: 40, fontSize: 16 }}
                    >
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
                    }}
                  >
                    <Popconfirm
                      placement="topLeft"
                      title="Voulez-vous vraiment rejeter cette demande ?"
                      description="Rejeter le demande"
                      okText="Oui"
                      cancelText="Non"
                      onConfirm={() => handleRefuse()}
                    >
                      <Button
                        type="default"
                        icon={<CloseOutlined />}
                        style={{ width: 150, height: 40, fontSize: 16 }}
                      >
                        Rejeter
                      </Button>
                    </Popconfirm>
                  </ConfigProvider>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              backgroundColor: "white",
              alignSelf: "center",
              borderRadius: 7,
              padding: 20,
              boxShadow: "0 0 2px black",
              width: 700,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <Result
                status="success"
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
                    }}
                  >
                    <Button
                      type="default"
                      onClick={() => navigate("/subscription")}
                    >
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
