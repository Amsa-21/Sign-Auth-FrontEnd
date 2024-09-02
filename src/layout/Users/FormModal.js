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
  Select,
  ConfigProvider,
} from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

function CollectionEditForm(onFormInstanceReady, initialValues) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(initialValues);
    onFormInstanceReady(form);
  }, [form, initialValues, onFormInstanceReady]);

  return (
    <Form layout="vertical" form={form} name="form_in_modal">
      <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date de naissance"
        rules={[{ required: true }]}>
        <Input type="date" />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true }]}>
        <Input type="email" />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input type="password" />
      </Form.Item>
      <Form.Item
        name="telephone"
        label="Téléphone"
        rules={[{ required: true }]}>
        <Input type="numero" />
      </Form.Item>
      <Form.Item
        name="organisation"
        label="Organisation"
        rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="poste" label="Poste" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Rôle"
        name="role"
        rules={[
          {
            required: true,
          },
        ]}>
        <Select
          placeholder="Sélectionner un rôle"
          options={[
            {
              value: "user",
              label: "Utilisateur",
            },
            {
              value: "admin",
              label: "Administrateur",
            },
          ]}
        />
      </Form.Item>
    </Form>
  );
}

function CollectionEditFormModal({
  open,
  onEdit,
  onCancel,
  initialValues,
  confirmLoading,
}) {
  const [formInstance, setFormInstance] = useState();

  const handleSubmit = async () => {
    try {
      const values = await formInstance?.validateFields();
      formInstance?.resetFields();
      onEdit(values);
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  return (
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
      <Modal
        open={open}
        onClose={onCancel}
        destroyOnClose
        centered
        footer={
          <Button
            style={{ height: 40, width: 125 }}
            loading={confirmLoading}
            onClick={handleSubmit}>
            Enregistrer
          </Button>
        }>
        {CollectionEditForm((instance) => {
          setFormInstance(instance);
        }, initialValues)}
      </Modal>
    </ConfigProvider>
  );
}

function FormModal() {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/allUsers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setData(response.data.result);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
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

  const handleDelete = async (record) => {
    const accessToken = localStorage.getItem("accessToken");
    const params = new URLSearchParams({
      id: record.id,
    }).toString();
    try {
      const response = await axios.delete(`${API_URL}/deleteUser?${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        message.success("Suppression effectuée avec succès");
        setData(response.data.result);
        console.log(response.data);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
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
          const retryResponse = await axios.delete(
            `${API_URL}/deleteUser?${params}`,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (retryResponse.data.success) {
            message.success("Suppression effectuée avec succès");
            setData(retryResponse.data.result);
            console.log(retryResponse.data);
          } else {
            message.error(retryResponse.data.error);
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
      } else {
        console.error("Erreur lors de la suppression :", error);
        message.error(error.message);
      }
    }
  };

  const onEdit = async (values) => {
    const accessToken = localStorage.getItem("accessToken");
    setConfirmLoading(true);
    const formData = new FormData();
    formData.append("member", JSON.stringify({ ...editingRecord, ...values }));
    try {
      const response = await axios.post(`${API_URL}/editUser`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        message.success("Modification effectuée avec succès");
        setData(response.data.result);
        setEditOpen(false);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
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
            `${API_URL}/editUser`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          if (retryResponse.data.success) {
            message.success("Modification effectuée avec succès");
            setData(retryResponse.data.result);
            setEditOpen(false);
          } else {
            message.error(retryResponse.data.error);
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
      } else {
        console.error("Erreur lors de la modification :", error);
        message.error(error.message);
      }
    } finally {
      setConfirmLoading(false);
    }
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
      title: "Prenom",
      dataIndex: "prenom",
      key: "prenom",
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Date de Naissance",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Téléphone",
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: "Organisation",
      dataIndex: "organisation",
      key: "organisation",
    },
    {
      title: "Poste",
      dataIndex: "poste",
      key: "poste",
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "ACTION",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditFilled twoToneColor="rgb(90,56,39)" />}
            onClick={() => handleEdit(record)}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft"
            title="Voulez-vous vraiment supprimer cet utilisateur ?"
            okText="Oui"
            cancelText="Non"
            onConfirm={() => handleDelete(record)}>
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
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#2b2b2b",
            headerColor: "white",
            rowHoverBg: "#fff",
          },
          Spin: {
            colorPrimary: "#5A3827",
          },
        },
      }}>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        size="small"
        bordered={false}
        pagination={false}
        loading={loading}
        style={{
          overflow: "auto",
          backgroundColor: "white",
          borderRadius: 7,
          boxShadow: "0 0 2px black",
        }}
      />

      {editingRecord && (
        <CollectionEditFormModal
          confirmLoading={confirmLoading}
          open={editOpen}
          onEdit={onEdit}
          onCancel={onEditCancel}
          initialValues={{
            prenom: editingRecord.prenom,
            nom: editingRecord.nom,
            date: editingRecord.date,
            email: editingRecord.email,
            password: editingRecord.password,
            telephone: editingRecord.telephone,
            organisation: editingRecord.organisation,
            poste: editingRecord.poste,
            role: editingRecord.role,
          }}
        />
      )}
    </ConfigProvider>
  );
}

CollectionEditFormModal.propTypes = {
  confirmLoading: PropTypes.bool,
  open: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  initialValues: PropTypes.object,
};

export default FormModal;
