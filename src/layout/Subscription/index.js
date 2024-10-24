import React, { useState } from "react";
import {
  Button,
  message,
  Steps,
  Typography,
  Form,
  Input,
  ConfigProvider,
} from "antd";
import logo from "./images/logo.png";
import VideoRecorder from "react-video-recorder-18";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../container/Sidenav/index.css";
import { LoadingOutlined } from "@ant-design/icons";
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
      navigate("/login");
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
        message.warning(
          "Veuillez enregistrer une vidéo de meilleure qualité pour continuer. Assurez-vous d'être bien éclairé et que votre visage soit clairement visible."
        );
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
            <Form.Item name="prenom" label="Prénom">
              <Input
                style={{ width: 235 }}
                required
                placeholder="Entrez votre prénom"
              />
            </Form.Item>
            <Form.Item name="nom" label="Nom">
              <Input
                style={{ width: 235 }}
                required
                placeholder="Entrez votre nom"
              />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item name="email" label="Email">
              <Input
                type="email"
                style={{ width: 235 }}
                required
                placeholder="Entrez votre email"
              />
            </Form.Item>
            <Form.Item
              name="numero"
              label="Téléphone"
              rules={[
                {
                  pattern: /^[0-9\b]+$/,
                  message: "Numéro de téléphone invalide",
                },
                {
                  min: 9,
                  message: "Numéro de téléphone trop court",
                },
              ]}>
              <Input
                type="tel"
                required
                style={{ width: 235 }}
                placeholder="Entrez votre numéro de téléphone"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="date"
            label="Date de naissance"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const birthDate = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  if (age < 18) {
                    return Promise.reject("Vous devez avoir au moins 18 ans");
                  }
                  return Promise.resolve();
                },
              },
            ]}>
            <Input
              type="date"
              style={{ width: 235 }}
              required
              placeholder="Sélectionnez votre date de naissance"
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[{ min: 8, message: "Le mot de passe est trop court" }]}>
              <Input.Password
                style={{ width: 235 }}
                required
                placeholder="Entrez votre mot de passe"
              />
            </Form.Item>
            <Form.Item name="password2" label="Confirmer le mot de passe">
              <Input.Password
                style={{ width: 235 }}
                required
                placeholder="Confirmez votre mot de passe"
              />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item name="organisation" label="Organisation">
              <Input
                style={{ width: 235 }}
                required
                placeholder="Entrez le nom de votre organisation"
              />
            </Form.Item>
            <Form.Item name="poste" label="Poste">
              <Input
                style={{ width: 235 }}
                required
                placeholder="Entrez votre poste"
              />
            </Form.Item>
          </div>
        </>
      ),
    },
    {
      title: "Face Scan",
      content: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {loading ? (
            <div style={{ display: "flex", gap: 10 }}>
              <LoadingOutlined spin={true} />
              <h3>Création du profil de l'utilisateur...</h3>
            </div>
          ) : (
            <>
              <div style={{ width: 500, height: 500 }}>
                <VideoRecorder onRecordingComplete={onRecordingComplete} />
              </div>
              <div
                style={{
                  marginBlock: "10px",
                  backgroundColor: "rgba(0,0,0,.5)",
                  padding: 10,
                  textAlign: "justify",
                  width: "100%",
                }}>
                <Typography.Text style={{ color: "yellow" }}>
                  * Enregistrez une vidéo de 10 secondes en pivotant votre
                  visage afin de capturer le maximum d'informations.
                </Typography.Text>
              </div>
            </>
          )}
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
            }}>
            {user.email && (
              <Typography.Text
                style={{ color: "black", fontSize: 16, textAlign: "center" }}>
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
        display: "flex",
      }}>
      <div
        style={{
          display: "flex",
          width: 800,
          backgroundColor: "#2B2B2B",
          padding: 50,
          height: "100vh",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 40,
            marginBlock: 10,
          }}>
          <img
            src={logo}
            alt="logo du site"
            width={300}
            style={{ marginLeft: 30 }}
          />
          <h2 style={{ fontSize: 30, color: "#f5f1e9", textAlign: "justify" }}>
            Prêt à signer vos documents en toute sécurité ?
          </h2>
          <p
            style={{
              fontSize: 16,
              textAlign: "justify",
              color: "rgba(245,241,232,.6)",
            }}>
            Améliorez vos processus de signature avec notre plateforme de
            signature électronique sécurisée, notre vérification d'identité
            avancée, et notre génération de certificats de conformité.
            Simplifiez la gestion de vos documents avec nos outils pratiques et
            nos ressources.
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}>
        <ConfigProvider
          theme={{
            components: {
              Steps: {
                colorText: "black",
                colorPrimary: "#5A3827",
                colorSplit: "rgba(0, 0, 0, 0.5)",
                colorTextQuaternary: "white",
              },
              Form: {
                labelColor: "black",
              },
              Input: {
                colorBorder: "#5A3827",
                hoverBorderColor: "grey",
                activeBorderColor: "grey",
              },
              Button: {
                defaultBg: "#5A3827",
                defaultHoverBg: "#fff",
                defaultColor: "#F5F1E9",
                defaultHoverColor: "#5A3827",
                defaultHoverBorderColor: "#5A3827",
                defaultBorderColor: "#5A3827",
                defaultActiveColor: "#5A3827",
                defaultActiveBorderColor: "#5A3827",
              },
            },
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 50,
              height: 150,
              borderBottom: "1px solid rgba(0,0,0,0.2)",
            }}>
            <Steps style={{ width: 500 }} current={current} items={items} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingBlock: 70,
              flexDirection: "column",
              width: "100%",
            }}>
            <Form layout="vertical" form={form} onFinish={next}>
              <div style={{ width: 500 }}>{steps[current].content}</div>
              {loading ? null : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    marginBlockStart: 25,
                  }}>
                  {current >= 0 && current <= 1 && (
                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            defaultBg: "#fff",
                            defaultHoverBg: "#5A3827",
                            defaultColor: "#5A3827",
                            defaultHoverColor: "#F5F1e9 ",
                            defaultHoverBorderColor: "#5A3827",
                            defaultBorderColor: "#5A3827 ",
                            defaultActiveBg: "#5A3827",
                            defaultActiveBorderColor: "#F5F1e9",
                            defaultActiveColor: "#F5F1e9",
                          },
                        },
                      }}>
                      <Button
                        type="default"
                        style={{
                          margin: "0 20px",
                          width: 115,
                          height: 40,
                        }}
                        onClick={() => prev()}>
                        Retour
                      </Button>
                    </ConfigProvider>
                  )}
                  {current < steps.length - 2 && (
                    <Button
                      style={{
                        width: 115,
                        height: 40,
                      }}
                      type="default"
                      htmlType="submit">
                      Suivant
                    </Button>
                  )}
                  {current === steps.length - 2 && (
                    <Button
                      type="default"
                      style={{
                        width: 115,
                        height: 40,
                      }}
                      onClick={handleFinish}>
                      Enregister
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Link to={"/login"}>
                      <Button
                        type="default"
                        style={{
                          height: 40,
                        }}>
                        Retourner à la page de connexion
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </Form>
          </div>
        </ConfigProvider>
      </div>
    </div>
  );
}
export default Subscription;
