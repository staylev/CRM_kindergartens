import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";

interface TableKindergartenProps {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
}

const TableKindergarten: React.FC<TableKindergartenProps> = ({ data, setData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = (record: any) => {
    setCurrentRecord(record);
    form.setFieldsValue(record.attributes);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedData = data.map((item) =>
        item.id === currentRecord.id ? { ...item, attributes: values } : item
      );
      setData(updatedData);
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleLinkClick = (record: any) => {
    navigate(`/Kindergartens/${record.id}`, { state: { record } });
  };

  const columns = [
    {
      title: "Название",
      dataIndex: ["attributes", "title"],
      key: "name",
      sorter: (a: any, b: any) => a.attributes.title.localeCompare(b.attributes.title),
    },
    {
      title: "Адрес",
      dataIndex: ["attributes", "address"],
      key: "address",
      sorter: (a: any, b: any) => a.attributes.address.localeCompare(b.attributes.address),
    },
    {
      title: "Основан в",
      dataIndex: ["attributes", "founded_by"],
      key: "founded_by",
      sorter: (a: any, b: any) => a.attributes.founded_by.localeCompare(b.attributes.founded_by),
    },
    {
      title: "Вместимость",
      dataIndex: ["attributes", "сapacity"],
      key: "сapacity",
      sorter: (a: any, b: any) => a.attributes.capacity.localeCompare(b.attributes.capacity),
    },
    {
      title: "Директор",
      dataIndex: ["attributes", "director"],
      key: "director",
      sorter: (a: any, b: any) => a.attributes.director.localeCompare(b.attributes.director),
    },
    {
      title: "Действия",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="link" onClick={() => showModal(record)}>Изменить</Button>
          <Button type="link" onClick={() => handleLinkClick(record)}>Подробнее</Button>
          <Popconfirm
            title="Удалить запись?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger>Удалить</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Всего ${total} записей`,
        }}
        locale={{
          emptyText: "Нет данных",
        }}
      />

      <Modal
        title="Редактировать запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Название" name="title"  >
            <Input />
          </Form.Item>
          <Form.Item label="Адрес" name="address"  >
            <Input />
          </Form.Item>
          <Form.Item label="Основан в" name="founded_by" >
            <Input />
          </Form.Item>
          <Form.Item label="Вместимость" name="сapacity"  >
            <Input  />
          </Form.Item>
          <Form.Item label="Директор" name="director"  >
            <Input  />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableKindergarten;