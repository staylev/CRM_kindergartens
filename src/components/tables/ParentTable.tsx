import { Button, Form, Input, Modal, Popconfirm, Select, Table, TableProps } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ParentsAttributes } from "../../types/Parent..type";

 
interface TablechildProps {
  refreshTable: number; // Используется как ключ обновления
}

type LayoutType = Parameters<typeof Form>[0]["layout"];

const ParentTable: React.FC<TablechildProps> = ({ refreshTable }) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState<ParentsAttributes[]>([]);
  const [childrenOptions, setChildrenOptions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadParents();
    loadChildren();
  }, [refreshTable]);

  const loadParents = () => {
    const parents = localStorage.getItem('parents');
    if (parents) {
      setDataSource(JSON.parse(parents));
    }
  };

  const loadChildren = () => {
    const childrenData = localStorage.getItem("children");
    if (!childrenData) return;
  
    try {
      const parsedData = JSON.parse(childrenData);
      const childrenList = parsedData.data || parsedData;
  
      setChildrenOptions(
        childrenList.map((child: any) => ({
          id: child.id,
          last_name: child.attributes?.last_name || "Без фамилии"
        }))
      );
    } catch (e) {
      console.error("Ошибка парсинга детей", e);
    }
  };

  const handleEdit = (record: ParentsAttributes) => {
    setEditingId(record.tg);
    form.setFieldsValue(record);
    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleLinkClick = (id: string) => {
    navigate(`/parents/${id}`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const parents = localStorage.getItem('parents') ? JSON.parse(localStorage.getItem('parents')!) : [];
      
      if (editingId) {
        const updatedParents = parents.map((parent: ParentsAttributes) => 
          parent.tg === editingId ? { ...parent, ...values } : parent
        );
        localStorage.setItem('parents', JSON.stringify(updatedParents));
      } else {
        const newParent = { ...values, tg: Date.now().toString() };
        localStorage.setItem('parents', JSON.stringify([...parents, newParent]));
      }
      
      loadParents();
      handleCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (id: string) => {
    const parents = localStorage.getItem('parents') ? JSON.parse(localStorage.getItem('parents')!) : [];
    const updatedParents = parents.filter((parent: ParentsAttributes) => parent.tg !== id);
    localStorage.setItem('parents', JSON.stringify(updatedParents));
    loadParents();
  };

  const columns: TableProps<ParentsAttributes>["columns"] = [
    {
      title: 'tg пользователя',
      dataIndex: 'tg',
      key: 'tg',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Имя',
      dataIndex: 'frist_name',
      key: 'frist_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Фамилия',
      dataIndex: 'last_name',
      key: 'last_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Телефон',
      dataIndex: 'number_phone',
      key: 'phone',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Дети',
      dataIndex: 'children_ids',
      key: 'children',
      render: (_, record) => {
        const childNames = record.children_ids
          .map((id: string) => {
            const child = childrenOptions.find((c: any) => c.id === id);
            return child ? child.last_name : null;
          })
          .filter(Boolean);
  
        return (
          <span>
            {childNames.length > 0 ? childNames.join(", ") : "Нет связанных детей"}
          </span>
        );
      },
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <div className="m-0">
          <Button type="link" onClick={() => handleEdit(record)}> 
            Изменить
          </Button>
          <Button type="link" onClick={() => handleLinkClick(record.tg)}> 
            Подробнее
          </Button>
          <Popconfirm
            title="Удаление записи"
            description="Вы уверены, что хотите удалить запись?"
            onConfirm={() => handleDelete(record.tg)}
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
    <div>
      <Table<ParentsAttributes>
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.tg}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Всего ${total} записей`,
        }}
        locale={{
          emptyText: "Нет данных",
          triggerDesc: "Сортировка по убыванию",
          triggerAsc: "Сортировка по возрастанию",
          cancelSort: "Отменить сортировку",
        }}
      />

      <Modal
        title={editingId ? "Редактировать запись" : "Добавить запись"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingId ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout={formLayout}
          initialValues={{ layout: formLayout }}
        >
          <Form.Item
            label="Telegram ID"
            name="tg"
            rules={[
              { required: true, message: "Пожалуйста, введите Telegram ID" },
            ]}
          >
            <Input placeholder="Telegram ID" disabled={!!editingId} />
          </Form.Item>
          <Form.Item
            label="Имя"
            name="frist_name"
            rules={[{ required: true, message: "Пожалуйста, введите имя" }]}
          >
            <Input placeholder="Имя" />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name="last_name"
            rules={[{ required: true, message: "Пожалуйста, введите фамилию" }]}
          >
            <Input placeholder="Фамилия" />
          </Form.Item>
          <Form.Item
            label="Телефон"
            name="number_phone"
            rules={[{ required: true, message: "Пожалуйста, введите телефон" }]}
          >
            <Input type="tel" placeholder="Телефон" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите электронную почту",
              },
            ]}
          >
            <Input type="email" placeholder="Электронная почта" />
          </Form.Item>
          <Form.Item
            label="Дети"
            name={["children", "id"]}
            rules={[
              { required: true, message: "Пожалуйста, добавьте ребёнка" },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              optionFilterProp="label"
            >
              {childrenOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ParentTable;