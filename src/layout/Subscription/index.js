import React, { useState } from "react";
import {
  Button,
  message,
  Steps,
  Typography,
  Form,
  Input,
  Spin,
  ConfigProvider,
} from "antd";
import bg from "./images/background.jpg";
import VideoRecorder from "react-video-recorder-18";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function Subscription() {
  document.getElementById("title").innerHTML =
    "Création de compte - Fraud Detection";

  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [video, setVideo] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const next = (values) => {
    if (current === 0 && values.password !== values.password2) {
      message.warning("Les mots de passes ne correspondent pas !");
    } else {
      form
        .validateFields()
        .then(setUser(values))
        .then(() => {
          setCurrent(current + 1);
        })
        .catch((info) => {
          console.log("Validate Failed:", info);
        });
    }
  };

  const prev = () => {
    if (current === 0) {
      navigate("login");
    } else {
      setCurrent(current - 1);
    }
  };

  const onRecordingComplete = (videoBlob) => {
    setVideo(videoBlob);
  };

  const handleFinish = async () => {
    if (video === null) {
      message.warning("Veuillez enregistrer votre vidéo pour continuer.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user", JSON.stringify(user));
      formData.append("file", video);
      const response = await axios.post(`${API_URL}/addUser`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setCurrent(current + 1);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.toString());
    }
    setLoading(false);
  };

  const steps = [
    {
      title: "Formulaire",
      content: (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="prenom"
              label="Prénom"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input style={{ width: 235 }} />
            </Form.Item>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input style={{ width: 235 }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input type="email" style={{ width: 235 }} />
            </Form.Item>
            <Form.Item
              name="date"
              label="Date de naissance"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input type="date" style={{ width: 235 }} />
            </Form.Item>
          </div>
          <Form.Item
            name="numero"
            label="Téléphone"
            rules={[{ required: true }]}
          >
            <Input type="numero" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[
                { min: 8, message: "Le mot de passe est trop court" },
                { required: true, message: "Ce champ est requis" },
              ]}
            >
              <Input.Password style={{ width: 235 }} />
            </Form.Item>
            <Form.Item
              name="password2"
              label="Confirmer le mot de passe"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input.Password style={{ width: 235 }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="organisation"
              label="Organisation"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input style={{ width: 235 }} />
            </Form.Item>
            <Form.Item
              name="poste"
              label="Poste"
              rules={[{ required: true, message: "Ce champ est requis" }]}
            >
              <Input style={{ width: 235 }} />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: "Face Scan",
      content: (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "50vh", height: "50vh" }}>
            <VideoRecorder onRecordingComplete={onRecordingComplete} />
          </div>
        </div>
      ),
    },
    {
      title: "Terminé",
      content: (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "50%",
            }}
          >
            {user.email && (
              <Typography.Text
                style={{ color: "white", fontSize: 16, textAlign: "center" }}
              >
                Votre compte a été crée avec succès. Le code secret de signature
                est envoyé sur cette adresse Email:{" "}
                <b>{user.email[0].toUpperCase() + user.email.slice(1)}</b>.
              </Typography.Text>
            )}
          </div>
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    icon: item.icon,
  }));

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          height: "100vh",
          backdropFilter: "blur(10px) brightness(70%)",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
            marginBlock: 70,
          }}
        >
          <ConfigProvider
            theme={{
              components: {
                Steps: {
                  colorText: "white",
                  colorPrimary: "#5A3827",
                  colorSplit: "rgba(255, 255, 255, 0.5)",
                  colorTextQuaternary: "white",
                },
                Form: {
                  labelColor: "white",
                },
                Button: {
                  defaultBg: "#5A3827",
                  defaultHoverBg: "#F5F1E9",
                  defaultColor: "#F5F1E9",
                  defaultHoverColor: "#5A3827",
                  defaultHoverBorderColor: "#F5F1E9",
                  defaultBorderColor: "#5A3827",
                  defaultActiveColor: "#5A3827",
                  defaultActiveBorderColor: "#5A3827",
                },
              },
            }}
          >
            <Steps style={{ width: 500 }} current={current} items={items} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                padding: 40,
                gap: 30,
                borderRadius: 10,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                boxShadow: "0 0 50px black",
                maxWidth: "min-content",
              }}
            >
              <Spin fullscreen spinning={loading} />
              <Form layout="vertical" form={form} onFinish={next}>
                <div style={{ minWidth: 500 }}>{steps[current].content}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginBlockStart: 25,
                  }}
                >
                  {current >= 0 && current <= 1 && (
                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            defaultBg: "#F5F1e9 ",
                            defaultHoverBg: "#5A3827",
                            defaultColor: "#5A3827",
                            defaultHoverColor: "#F5F1e9 ",
                            defaultHoverBorderColor: "#5A3827",
                            defaultBorderColor: "#F5F1e9 ",
                            defaultActiveBg: "#5A3827",
                            defaultActiveBorderColor: "#F5F1e9",
                            defaultActiveColor: "#F5F1e9",
                          },
                        },
                      }}
                    >
                      <Button
                        type="default"
                        style={{
                          margin: "0 20px",
                          width: 120,
                        }}
                        onClick={() => prev()}
                      >
                        Retour
                      </Button>
                    </ConfigProvider>
                  )}
                  {current < steps.length - 2 && (
                    <Button
                      style={{
                        width: 120,
                      }}
                      type="default"
                      htmlType="submit"
                    >
                      Suivant
                    </Button>
                  )}
                  {current === steps.length - 2 && (
                    <Button
                      type="default"
                      style={{
                        width: 120,
                      }}
                      onClick={handleFinish}
                    >
                      Enregister
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button type="default" onClick={() => navigate("/login")}>
                      Retourner à la page de connexion
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}
export default Subscription;
