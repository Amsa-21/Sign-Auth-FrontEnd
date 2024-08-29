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
        rules={[{ required: true }]}
      >
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
        rules={[{ required: true }]}
      >
        <Input type="numero" />
      </Form.Item>
      <Form.Item
        name="organisation"
        label="Organisation"
        rules={[{ required: true }]}
      >
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
        ]}
      >
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
      okText="Enregistrer"
      cancelText="Annuler"
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
  const [editOpen, setEditOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const onEditCancel = () => {
    setEditOpen(false);
  };

  const onEdit = async (values) => {
    setConfirmLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        "member",
        JSON.stringify({ ...editingRecord, ...values })
      );
      const response = await axios.post(`${API_URL}/editUser`, formData, {});

      if (response.data.success) {
        message.success("Modification effectuée avec succès");
        setData(response.data.result);
        setEditOpen(false);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    setConfirmLoading(false);
  };

  const handleDelete = async (record) => {
    try {
      const params = new URLSearchParams({
        id: record.id,
      }).toString();
      const response = await axios.delete(`${API_URL}/deleteUser?${params}`);

      if (response.data.success) {
        message.success("Suppression effectuée avec succès");
        setData(response.data.result);
        console.log(response.data);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/allUsers`);
        setData(response.data.result);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        message.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
      }}
    >
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
