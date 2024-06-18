import React, { useEffect, useState } from "react";
import {
  Divider,
  message,
  Button,
  Form,
  Input,
  Modal,
  Flex,
  Table,
  Popconfirm,
  Select,
} from "antd";
import {
  PlusSquareTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";
import API_URL from "../../config";

function CollectionCreateForm(onFormInstanceReady) {
  const [form] = Form.useForm();

  useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  return (
    <Form layout="vertical" form={form} name="form_in_modal">
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Select
          placeholder="Select a role"
          options={[
            {
              value: "user",
              label: "User",
            },
            {
              value: "admin",
              label: "Admin",
            },
          ]}
        />
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
      title="New user"
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
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Field cannot be empty!",
          },
        ]}
      >
        <Select
          placeholder="Select a role"
          options={[
            {
              value: "user",
              label: "User",
            },
            {
              value: "admin",
              label: "Admin",
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
      title="Edit user"
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

  const onCreate = async (values) => {
    setConfirmLoading(true);
    try {
      const formData = new FormData();
      formData.append("member", JSON.stringify(values));

      const response = await axios.post(`${API_URL}/addUser`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
      console.error(error);
      message.error("Add failed");
    }
    setConfirmLoading(false);
  };

  const onCancel = () => {
    setOpen(false);
  };

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
        message.success("Edit successful");
        setData(response.data.result);
        console.log(response.data);
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
        message.success("Delete successful");
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
        console.log(response.data.result);
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
      title: "Username",
      dataIndex: "username",
      key: "username",
      align: "center",
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "OPTIONS",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="text"
            icon={<EditTwoTone twoToneColor="rgb(218,165,32)" />}
            onClick={() => handleEdit(record)}
          />
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft"
            title="Are you sure to delete this user?"
            description="Delete this user"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button
              type="text"
              icon={<DeleteTwoTone twoToneColor="rgb(256,0,0)" />}
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
      <Flex style={{ marginBottom: 20 }} vertical align="end">
        <Button icon={<PlusSquareTwoTone />} onClick={() => setOpen(true)}>
          Add New User
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        size="small"
        bordered={true}
        loading={loading}
      />
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
            username: editingRecord.username,
            email: editingRecord.email,
            password: editingRecord.password,
            role: editingRecord.role,
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
