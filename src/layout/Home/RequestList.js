import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  message,
  Divider,
  Table,
  Button,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Input,
  Typography,
  notification,
} from "antd";
import {
  SignatureOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_URL = process.env.REACT_APP_API_BASE_URL;

function RequestList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const webcamRef = useRef(null);
  const [res, setRes] = useState(null);
  const [img, setImg] = useState(null);
  const [dataPDF, setDataPDF] = useState("");
  const [id, setID] = useState();
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const capture = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", webcamRef.current.getScreenshot());

      const response = await axios.post(`${API_URL}/predict`, formData, {});
      if (response.data.success) {
        setRes(response.data.person);
        setImg(response.data.face);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.toString());
    }
    setLoading(false);
    setOpen1(false);
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/allRequest`);
        setData(response.data.result);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        message.error(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statusControle = (item) => {
    switch (item) {
      case 0:
        return (
          <Tag
            icon={<SyncOutlined spin />}
            color="#108ee9"
            style={{ width: 85 }}
          >
            En cours
          </Tag>
        );
      case 1:
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#87d068"
            style={{ width: 85 }}
          >
            Complete
          </Tag>
        );
      case 2:
        return (
          <Tag
            icon={<CloseCircleOutlined />}
            color="#f50"
            style={{ width: 85 }}
          >
            Rejetée
          </Tag>
        );
      default:
    }
  };

  let dataWithKeys = data.map((item, index) => ({
    ...item,
    signataires: item.signers,
    statut: item.signatures.includes(person) ? (
      <Tag icon={<CheckCircleOutlined />} color="#87d068" style={{ width: 85 }}>
        Complete
      </Tag>
    ) : (
      statusControle(item.status)
    ),
    key: item.id || index,
    signats: item.signatures.includes(person) ? true : false,
  }));
  dataWithKeys = dataWithKeys.filter((item) => item.signers.includes(person));

  const handleSign = (record) => {
    setOpen1(true);
    setID(record.id);
  };

  const handleSignPDF = async (values) => {
    try {
      setLoadingSign(true);
      const formData = new FormData();
      formData.append("user", person);
      formData.append("code", values.code);
      formData.append("image", img);
      formData.append("id", id);

      const response = await axios.post(`${API_URL}/signPDF`, formData, {});
      if (response.data.success) {
        setOpen(false);
        message.success("Signature réussie !");
        window.location.reload();
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
      setLoadingSign(false);
    }
  };

  const handleRefuse = async (record) => {
    try {
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.post(`${API_URL}/refuseRequest?${params}`);

      if (response.data.success) {
        message.success("Demande refusée avec succès");
        setData(response.data.result);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleViewPFDF = async (record) => {
    try {
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.post(`${API_URL}/getPDF?${params}`);

      if (response.data.success) {
        setDataPDF(response.data.result);
        console.log(dataPDF);
        setOpen2(true);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Objet",
      dataIndex: "object",
      key: "object",
    },
    {
      title: "Commentaire",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Demandeur",
      dataIndex: "person",
      key: "person",
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      align: "center",
    },
    {
      title: "OPTIONS",
      align: "center",
      width: 150,
      render: (_, record) => {
        if (record.status === 0 && record.signats === false) {
          return (
            <>
              <Button
                type="text"
                onClick={() => handleViewPFDF(record)}
                icon={<EyeOutlined style={{ color: "rgb(0, 100, 200)" }} />}
              />
              <Divider type="vertical" />
              <Button
                type="text"
                onClick={() => handleSign(record)}
                icon={
                  <SignatureOutlined style={{ color: "rgb(50, 200, 100)" }} />
                }
              />
              <Divider type="vertical" />
              <Popconfirm
                placement="topLeft"
                title="Voulez-vous vraiment rejeter cette demande ?"
                description="Rejeter le demande"
                okText="Oui"
                cancelText="Non"
                onConfirm={() => handleRefuse(record)}
              >
                <Button
                  type="text"
                  icon={<CloseOutlined style={{ color: "rgb(256, 0, 0)" }} />}
                />
              </Popconfirm>
            </>
          );
        } else {
          return (
            <Button
              type="text"
              onClick={() => handleViewPFDF(record)}
              icon={<EyeOutlined style={{ color: "rgb(0, 100, 200)" }} />}
            />
          );
        }
      },
    },
  ];

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
    <>
      <Modal
        open={open1}
        title="Scan du visage"
        footer={
          <Button
            type="primary"
            style={{ backgroundColor: "#072142" }}
            onClick={capture}
            loading={loading}
          >
            Prendre la photo
          </Button>
        }
        onCancel={() => {
          setOpen1(false);
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
      <Modal
        open={open}
        title="Signer le document"
        onCancel={() => {
          setRes(null);
          setOpen(false);
        }}
        footer={null}
        centered={true}
      >
        <Divider />
        {res && (
          <>
            {res === person ? (
              <Form layout="vertical" onFinish={handleSignPDF}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <Form.Item
                    label={"Code Secret"}
                    name="code"
                    rules={[
                      {
                        required: true,
                        message: "Veuiller entrer votre code secret !",
                      },
                    ]}
                  >
                    <Input.OTP length={6} mask="🔒" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: 120, backgroundColor: "#072142" }}
                      loading={loadingSign}
                    >
                      Signer
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography.Text strong style={{ color: "red" }}>
                    Echec de la vérification d'identité !
                  </Typography.Text>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "#072142" }}
                    onClick={() => setOpen1(true)}
                  >
                    Réessayer la vérification
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </Modal>
      <Modal
        open={open2}
        title="Aperçu du Document"
        footer={null}
        onCancel={() => {
          setOpen2(false);
        }}
        width={"90%"}
      >
        <Divider />
        {dataPDF && (
          <div style={{ display: "flex" }}>
            <embed
              type="application/pdf"
              src={URL.createObjectURL(base64toBlob(dataPDF))}
              width={"100%"}
              height={700}
            />
          </div>
        )}
      </Modal>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        size="small"
        bordered={true}
        loading={loading}
        style={{ overflow: "auto" }}
      />
    </>
  );
}

export default RequestList;
