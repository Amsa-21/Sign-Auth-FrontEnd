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

  const onCreate = async (values) => {
    setConfirmLoading(true);
    try {
      const formData = new FormData();
      formData.append("member", JSON.stringify(values));

      const response = await axios.post(`${API_URL}/addMember`, formData, {
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
      const response = await axios.post(`${API_URL}/editOne`, formData, {});

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
      const response = await axios.delete(`${API_URL}/deleteOne?${params}`);

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
        const response = await axios.get(`${API_URL}/ownMember`);
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
      title: "COUNTRY / REGION CODE",
      dataIndex: "codePaysRegion",
      key: "codePaysRegion",
      align: "center",
    },
    {
      title: "COMPANY NAME",
      dataIndex: "nomEntreprise",
      key: "nomEntreprise",
    },
    {
      title: "HEADQUARTERS LOCATION",
      dataIndex: "emplacementSiegeSocial",
      key: "emplacementSiegeSocial",
    },
    {
      title: "TEXT TO FIND",
      dataIndex: "textFind",
      key: "textFind",
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
            title="Are you sure to delete this member?"
            description="Delete this member"
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
          Add New Member
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
