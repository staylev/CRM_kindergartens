import { Button, Form, Input, message, Modal, Popconfirm, Result, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Groups, ListGroups } from "../../types/Groups..type";

interface TableGroupProps {
  refreshTable: boolean;
}

type LayoutType = Parameters<typeof Form>[0]["layout"];

const GroupTable: React.FC<TableGroupProps> = ({ refreshTable }) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Groups | null>(null);
  const [data, setData] = useState<ListGroups>({
    included: [],
    meta: {
      count: 0,
      totalPages: 1,
    },
    data: [],
  });

  // Загрузка данных из localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("groups");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [refreshTable]);

  // Удаление группы
  const handleDelete = (id: string) => {
    const updatedData = {
      ...data,
      data: data.data.filter((item) => item.id !== id),
    };
    localStorage.setItem("groups", JSON.stringify(updatedData));
    setData(updatedData);
    message.success(`Запись ${id} удалена`);
  };

  // Редактирование группы
  const handleEdit = (record: Groups) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      attributes: {
        title: record.attributes.title,
        kindergarten_title: record.attributes.kindergarten_title,
        type_group: record.attributes.type_group,
      },
    });
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  const handleLinkClick = (record: Groups) => {
    navigate(`/groups/${record.id}`);
  };

  // Сохранить изменения
  const handleOk = () => {
    form.validateFields().then(values => {
      const updatedData = {
        ...data,
        data: data.data.map(item =>
          item.id === currentRecord?.id
            ? {
                ...item,
                attributes: {
                  ...item.attributes,
                  title: values.attributes.title,
                  kindergarten_title: values.attributes.kindergarten_title,
                  type_group: values.attributes.type_group,
                },
              }
            : item
        ),
      };
      localStorage.setItem("groups", JSON.stringify(updatedData));
      setData(updatedData);
      setIsModalOpen(false);
      form.resetFields();
    });  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Колонки таблицы
  const columns = [
    {
      title: "Название",
      dataIndex: ["attributes", "title"],
      key: "name",
      sorter: (a: Groups, b: Groups) => a.attributes.title.localeCompare(b.attributes.title),
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Детский сад",
      dataIndex: ["attributes", "kindergarten_title"],
      key: "kindergarten_title",
      sorter: (a: Groups, b: Groups) =>
        a.attributes.kindergarten_title.localeCompare(b.attributes.kindergarten_title),
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Тип группы",
      dataIndex: ["attributes", "type_group"],
      key: "type_group",
      sorter: (a: Groups, b: Groups) =>
        a.attributes.type_group.localeCompare(b.attributes.type_group),
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: Groups) => (
        <div className="m-0">
          <Button type="link" onClick={() => handleEdit(record)}>
            Изменить
          </Button>
          <Button type="link" onClick={() => handleLinkClick(record)}>
            Подробнее
          </Button>
          <Popconfirm
            title="Удаление записи"
            description="Вы уверены, что хотите удалить запись?"
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
    <div>
      <Table
        columns={columns}
        dataSource={data.data}
        rowKey={(record) => record.id}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
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
        <Form layout={formLayout} form={form}>
          <Form.Item
            label="Название"
            name={["attributes", "title"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите название группы",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Детский сад"
            name={["attributes", "kindergarten_title"]}
            rules={[
              { required: true, message: "Пожалуйста, выберите детский сад" },
            ]}
          >
            <Select style={{ width: 200 }} placeholder="Выберите детский сад">
              {(() => {
                const storedData = localStorage.getItem("kindergartens");
                if (!storedData) return null;

                try {
                  const kindergartens = JSON.parse(storedData);
                  return kindergartens.map((item: any) => (
                    <Select.Option key={item.id} value={item.attributes.title}>
                      {item.attributes.title}
                    </Select.Option>
                  ));
                } catch (e) {
                  console.error("Ошибка парсинга данных о детских садах:", e);
                  return null;
                }
              })()}
            </Select>
          </Form.Item>
          <Form.Item
          name={["attributes", "type_group"]}
          label="Тмп группы">
            <Select style={{ width: 200 }}>
              <option value="Ясельная группа">Ясельная группа</option>
              <option value="Младшая группа">Младшая группа</option>
              <option value="Средняя группа">Средняя группа</option>
              <option value="Старшая группа">Старшая группа</option>
              <option value="Подготовительная группа">
                Подготовительная группа
              </option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupTable;