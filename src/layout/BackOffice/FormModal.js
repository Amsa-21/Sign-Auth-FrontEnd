import React, { useEffect, useState } from "react";
import {
  Divider,
  message,
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  ConfigProvider,
} from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function CollectionCreateForm(onFormInstanceReady) {
  const [form] = Form.useForm();

  useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  return (
    <Form layout="vertical" form={form} name="form_in_modal">
      <Form.Item
        label="Company Name"
        name="cName"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="Sonatel" />
      </Form.Item>
      <Form.Item
        label="Headquarters Location"
        name="hLocation"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="Senegal" />
      </Form.Item>
      <Form.Item
        label="Country/Region Code"
        name="codeCountryRegion"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="SN" maxLength={2} />
      </Form.Item>
      <Form.Item
        label="Text to find"
        name="textFind"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="" />
      </Form.Item>
    </Form>
  );
}

function CollectionCreateFormModal({
  confirmLoading,
  open,
  onCreate,
  onCancel,
}) {
  const [formInstance, setFormInstance] = useState();
  return (
    <Modal
      open={open}
      title="New Trust Member"
      okText="Add"
      cancelText="Cancel"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={onCancel}
      destroyOnClose
      confirmLoading={confirmLoading}
      centered={true}
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          formInstance?.resetFields();
          onCreate(values);
        } catch (error) {
          console.error("Failed:", error);
        }
      }}
    >
      {CollectionCreateForm((instance) => {
        setFormInstance(instance);
      })}
    </Modal>
  );
}

function CollectionEditForm(onFormInstanceReady, initialValues) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(initialValues);
    onFormInstanceReady(form);
  }, [form, initialValues, onFormInstanceReady]);

  return (
    <Form layout="vertical" form={form} name="form_in_modal">
      <Form.Item
        label="Company Name"
        name="cName"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="Sonatel" />
      </Form.Item>
      <Form.Item
        label="Headquarters Location"
        name="hLocation"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="Senegal" />
      </Form.Item>
      <Form.Item
        label="Country/Region Code"
        name="codeCountryRegion"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="SN" maxLength={2} />
      </Form.Item>
      <Form.Item
        label="Text to find"
        name="textFind"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input placeholder="" />
      </Form.Item>
    </Form>
  );
}

function CollectionEditFormModal({
  confirmLoading,
  open,
  onEdit,
  onCancel,
  initialValues,
}) {
  const [formInstance, setFormInstance] = useState();
  return (
    <Modal
      open={open}
      title="Edit Trust Member"
      okText="Save"
      cancelText="Cancel"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={onCancel}
      destroyOnClose
      confirmLoading={confirmLoading}
      centered={true}
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          formInstance?.resetFields();
          onEdit(values);
        } catch (error) {
          console.error("Failed:", error);
        }
      }}
    >
      {CollectionEditForm((instance) => {
        setFormInstance(instance);
      }, initialValues)}
    </Modal>
  );
}

function FormModal() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
  
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/ownMember`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.result);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const refreshResponse = await axios.post(`${API_URL}/refresh`, {}, {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            });
  
            const newAccessToken = refreshResponse.data.access_token;
            localStorage.setItem("accessToken", newAccessToken);
            const retryResponse = await axios.get(`${API_URL}/ownMember`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            setData(retryResponse.data.result);
          } catch (refreshError) {
            console.error("Erreur lors du rafraîchissement du token :", refreshError);
            message.error("Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter.");
          }
        } else {
          console.error("Erreur lors de la récupération des données :", error);
          message.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const onCreate = async (values) => {
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("member", JSON.stringify(values));
    setConfirmLoading(true);
    try {
      const response = await axios.post(`${API_URL}/addMember`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data.success) {
        message.success("Add successful");
        setData(response.data.result);
        console.log(response.data);
        setOpen(false);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(`${API_URL}/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
  
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.post(`${API_URL}/addMember`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
  
          if (retryResponse.data.success) {
            message.success("Add successful");
            setData(retryResponse.data.result);
            console.log(retryResponse.data);
            setOpen(false);
          } else {
            message.error(retryResponse.data.error);
          }
        } catch (refreshError) {
          console.error("Erreur lors du rafraîchissement du token :", refreshError);
          message.error("Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter.");
        }
      } else {
        console.error("Erreur lors de l'ajout :", error);
        message.error("Add failed");
      }
    } finally {
      setConfirmLoading(false);
    }
  };
  
  const onEdit = async (values) => {
    const accessToken = localStorage.getItem("accessToken");
    setConfirmLoading(true);
    const formData = new FormData();
      formData.append(
        "member",
        JSON.stringify({ ...editingRecord, ...values })
      );
    try {
      const response = await axios.post(`${API_URL}/editOne`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data.success) {
        message.success("Edit successful");
        setData(response.data.result);
        console.log(response.data);
        setEditOpen(false);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(`${API_URL}/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
  
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.post(`${API_URL}/editOne`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
  
          if (retryResponse.data.success) {
            message.success("Edit successful");
            setData(retryResponse.data.result);
            console.log(retryResponse.data);
            setEditOpen(false);
          } else {
            message.error(retryResponse.data.error);
          }
        } catch (refreshError) {
          console.error("Erreur lors du rafraîchissement du token :", refreshError);
          message.error("Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter.");
        }
      } else {
        console.error("Erreur lors de l'édition :", error);
        message.error(error.message);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDelete = async (record) => {
    const accessToken = localStorage.getItem("accessToken");
    const params = new URLSearchParams({
        id: record.id,
      }).toString();
    try {  
      const response = await axios.delete(`${API_URL}/deleteOne?${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.data.success) {
        message.success("Delete successful");
        setData(response.data.result);
        console.log(response.data);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const refreshResponse = await axios.post(`${API_URL}/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
  
          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const retryResponse = await axios.delete(`${API_URL}/deleteOne?${params}`, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
  
          if (retryResponse.data.success) {
            message.success("Delete successful");
            setData(retryResponse.data.result);
            console.log(retryResponse.data);
          } else {
            message.error(retryResponse.data.error);
          }
        } catch (refreshError) {
          console.error("Erreur lors du rafraîchissement du token :", refreshError);
          message.error("Une erreur s'est produite lors du rafraîchissement du token. Veuillez vous reconnecter.");
        }
      } else {
        console.error("Erreur lors de la suppression :", error);
        message.error(error.message);
      }
    }
  };  

  const onCancel = () => {
    setOpen(false);
  };

  const onEditCancel = () => {
    setEditOpen(false);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditOpen(true);
  };

  const columns = [
    {
      title: "Code pays",
      dataIndex: "codePaysRegion",
      key: "codePaysRegion",
      align: "center",
    },
    {
      title: "Entreprise",
      dataIndex: "nomEntreprise",
      key: "nomEntreprise",
    },
    {
      title: "Pays ou zone géographique",
      dataIndex: "emplacementSiegeSocial",
      key: "emplacementSiegeSocial",
    },
    {
      title: "Texte à trouver",
      dataIndex: "textFind",
      key: "textFind",
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditFilled style={{ color: "rgb(90,56,39)" }} />}
            onClick={() => handleEdit(record)}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft"
            title="Are you sure to delete this member?"
            description="Delete this member"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button
              type="text"
              icon={<DeleteFilled style={{ color: "rgb(256,0,0)" }} />}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  const dataWithKeys = data.map((item, index) => ({
    ...item,
    key: item.id || index,
  }));

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#2b2b2b",
              headerColor: "white",
              rowHoverBg: "#fff",
              colorPrimary: "#5A3827",
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
              borderRadius: "6px 6px 6px 0px ",
            },
            Spin: {
              colorPrimary: "#5A3827",
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "flex-end",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          ></div>
          <Button onClick={() => setOpen(true)}>
            Ajouter un nouveau membre
          </Button>
        </div>

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
          loading={loading}
        />
      </ConfigProvider>

      <CollectionCreateFormModal
        confirmLoading={confirmLoading}
        open={open}
        onCreate={onCreate}
        onCancel={onCancel}
      />
      {editingRecord && (
        <CollectionEditFormModal
          confirmLoading={confirmLoading}
          open={editOpen}
          onEdit={onEdit}
          onCancel={onEditCancel}
          initialValues={{
            cName: editingRecord.nomEntreprise,
            hLocation: editingRecord.emplacementSiegeSocial,
            codeCountryRegion: editingRecord.codePaysRegion,
            textFind: editingRecord.textFind,
          }}
        />
      )}
    </>
  );
}

CollectionEditFormModal.propTypes = {
  confirmLoading: PropTypes.bool,
  open: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
};

CollectionCreateFormModal.propTypes = {
  confirmLoading: PropTypes.bool,
  open: PropTypes.bool,
  onCreate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default FormModal;
