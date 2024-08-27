import React, { useState, useRef, useEffect } from "react";
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
  ConfigProvider,
  Spin,
  Popover,
  Checkbox,
} from "antd";
import {
  SignatureFilled,
  CloseOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  EyeFilled,
  DatabaseOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import Card from "../component/Card";
import Webcam from "react-webcam";
import ModalPDF from "../component/ModalPDF";

const CheckboxGroup = Checkbox.Group;

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

const API_URL = process.env.REACT_APP_API_BASE_URL;

function RequestList() {
  const [loadingSign, setLoadingSign] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const webcamRef = useRef(null);
  const [res, setRes] = useState(null);
  const [img, setImg] = useState(null);
  const [dataPDF, setDataPDF] = useState("");
  const [id, setID] = useState();
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const person =
    localStorage.getItem("username") + " " + localStorage.getItem("telephone");

  const plainOptions = ["Complete", "En cours", "Rejetée"];
  const defaultCheckedList = ["Complete", "En cours", "Rejetée"];

  const [checkedList, setCheckedList] = useState(defaultCheckedList || []);
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const statusControle = (item) => {
    switch (item) {
      case 0:
        return (
          <Tag
            icon={<SyncOutlined spin />}
            color="#108ee9"
            style={{ width: 90 }}
          >
            En cours
          </Tag>
        );
      case 1:
        return (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#87d068"
            style={{ width: 90 }}
          >
            Complete
          </Tag>
        );
      case 2:
        return (
          <Tag
            icon={<CloseCircleOutlined />}
            color="#f50"
            style={{ width: 90 }}
          >
            Rejetée
          </Tag>
        );
      default:
    }
  };

  let stat = checkedList.map((item, _) => ({
    status:
      item === "Complete"
        ? 1
        : item === "En cours"
        ? 0
        : item === "Rejetée"
        ? 2
        : null,
  }));

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
  dataWithKeys = dataWithKeys.filter(
    (item) =>
      item.signers.includes(person) &&
      stat.some((s) => s.status === item.status)
  );

  let databrute = data.map((item, _) => ({
    ...item,
  }));
  databrute = databrute.filter((item) => item.signers.includes(person));

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
        window.location.reload();
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleViewPDF = async (record) => {
    try {
      setLoad(true);
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.post(`${API_URL}/getPDF?${params}`);

      if (response.data.success) {
        setDataPDF(response.data.result);
        setOpen2(true);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setLoad(false);
    }
  };

  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: 155,
      render: (_, record) => {
        const [time, date] = record.date.split(" ");
        const [hours, minutes] = time.split(":");
        const [day, month] = date.split("/");
        return `${parseInt(day)} ${mois[parseInt(month) - 1]} à ${parseInt(
          hours
        )}h ${parseInt(minutes)}mn`;
      },
    },
    {
      title: "Objet",
      dataIndex: "object",
      key: "object",
      width: "15%",
    },
    {
      title: "Commentaire",
      dataIndex: "comment",
      key: "comment",
      width: "30%",
    },
    {
      title: "Demandeur",
      dataIndex: "person",
      key: "person",
      render: (_, record) => {
        return record.person
          .split(" ")
          .slice(0, -1)
          .map((elem) => elem)
          .join(" ");
      },
    },
    {
      title: "Durée",
      dataIndex: "dated",
      key: "dated",
      width: 150,
      render: (_, record) => {
        const [time, date] = record.date.split(" ");
        const formattedDate = date.split("/").reverse().join("-") + "T" + time;
        const givenDate = new Date(formattedDate);
        const now = new Date();
        const differenceInMs = now - givenDate;
        const hours = Math.floor((differenceInMs / 1000 / 60 / 60) % 24);
        const days = Math.floor(differenceInMs / 1000 / 60 / 60 / 24);
        return `${days} jours, ${hours} heures`;
      },
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      align: "center",
      width: 100,
    },
    {
      title: "Action",
      align: "center",
      width: 150,
      render: (_, record) => {
        if (record.status === 0 && record.signats === false) {
          return (
            <>
              <Button
                type="text"
                onClick={() => handleViewPDF(record)}
                icon={<EyeFilled style={{ color: "rgb(90,56,39)" }} />}
              />
              <Divider type="vertical" />
              <Button
                type="text"
                onClick={() => handleSign(record)}
                icon={<SignatureFilled style={{ color: "#87d068" }} />}
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
                  icon={<CloseCircleFilled style={{ color: "#ff5500" }} />}
                />
              </Popconfirm>
            </>
          );
        } else {
          return (
            <Button
              type="text"
              onClick={() => handleViewPDF(record)}
              icon={<EyeFilled style={{ color: "rgb(90,56,39)" }} />}
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
      <Spin fullscreen spinning={load || loading} />
      <Modal
        open={open1}
        title="Scan du visage"
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
              style={{ width: 150 }}
              onClick={capture}
              loading={loading}
            >
              Prendre la photo
            </Button>
          </ConfigProvider>
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
                      type="default"
                      htmlType="submit"
                      style={{ width: 150 }}
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
                  <Button type="default" onClick={() => setOpen1(true)}>
                    Réessayer la vérification
                  </Button>
                </div>
              </>
            )}
          </ConfigProvider>
        )}
      </Modal>
      <ModalPDF
        open={open2}
        onClose={() => setOpen2(false)}
        content={
          dataPDF && (
            <div
              style={{
                display: "flex",
              }}
            >
              <embed
                type="application/pdf"
                src={URL.createObjectURL(base64toBlob(dataPDF))}
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

      {databrute && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: "25%",
              borderRadius: 7,
              boxShadow: "0 0 2px black",
              paddingInline: 20,
              backgroundColor: "rgb(43, 43, 43)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: "20px",
              }}
            >
              <h5
                style={{
                  fontFamily: "Segoe UI, Arial, sans-serif",
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.6)",
                  margin: 0,
                }}
              >
                Total des demandes
              </h5>
              <DatabaseOutlined style={{ fontSize: 20, color: "white" }} />
            </div>
            <h1
              style={{
                color: "#fff",
                margin: "10px 0",
              }}
            >
              {databrute.length}
            </h1>
          </div>
          <Card
            title="Demandes completes"
            icon={
              <UnorderedListOutlined
                style={{ fontSize: 20, color: "rgb(0, 0, 0)" }}
              />
            }
            value={databrute.filter((item) => item.status === 1).length}
          />
          <Card
            title="Demandes en cours"
            icon={
              <ReloadOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={databrute.filter((item) => item.status === 0).length}
          />
          <Card
            title="Demandes rejetées"
            icon={
              <CloseOutlined style={{ fontSize: 20, color: "rgb(0, 0, 0)" }} />
            }
            value={databrute.filter((item) => item.status === 2).length}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: 20,
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        ></div>
        <div style={{ display: "flex", width: 40 }}>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
                Button: {
                  colorPrimaryHover: "#5A3827",
                  borderRadius: "6px 6px 6px 0",
                },
                Checkbox: {
                  colorPrimary: "#5A3827",
                  colorPrimaryHover: "#5A3827",
                },
              },
            }}
          >
            <Popover
              placement="rightTop"
              content={
                <div>
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                  >
                    Tout selectionné
                  </Checkbox>
                  <Divider />
                  <CheckboxGroup
                    options={plainOptions}
                    value={checkedList}
                    onChange={onChange}
                  />
                </div>
              }
              title="Filtre"
              trigger="click"
            >
              <Button
                style={{ width: 40 }}
                icon={
                  <FilterOutlined style={{ fontSize: 20, color: "5A3827" }} />
                }
              ></Button>
            </Popover>
          </ConfigProvider>
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#2b2b2b",
              headerColor: "white",
              rowHoverBg: "#fff",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={dataWithKeys}
          size="small"
          bordered={false}
          style={{
            overflow: "auto",
            boxShadow: "0 0 2px black",
            borderRadius: 7,
          }}
          pagination={false}
        />
      </ConfigProvider>
    </>
  );
}

export default RequestList;
