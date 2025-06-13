import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Result, Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { children, ListChild } from "../../types/children.types";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";

interface TablechildProps {
  refreshTable: boolean;
}

type LayoutType = Parameters<typeof Form>[0]["layout"];

const ChildTable: React.FC<TablechildProps> = ({ refreshTable }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<children | null>(null);
  const [childData, setChildData] = useState<ListChild>({
    included: [],
    meta: { count: 0, totalPages: 1 },
    data: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [kindergartens, setKindergartens] = useState<any[]>([]);

 
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedChildren = localStorage.getItem('children');
      const storedkindergartens = localStorage.getItem('kindergartens');
      const storedGroups = localStorage.getItem('groups');
      
      if (storedChildren) {
        setChildData(JSON.parse(storedChildren));
      }
      if (storedkindergartens) {
        setKindergartens(JSON.parse(storedkindergartens));
      }
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups).data || []);
      }
    } catch (error) {
      message.error('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  }, [refreshTable]);

  const handleDelete = (id: string) => {
    try {
      const updatedData = {
        ...childData,
        data: childData.data.filter(child => child.id !== id),
        meta: {
          ...childData.meta,
          count: childData.meta.count - 1
        }
      };
      localStorage.setItem('children', JSON.stringify(updatedData));
      setChildData(updatedData);
      message.success(`Запись ${id} удалена`);
    } catch (error) {
      message.error("Ошибка при удалении ребёнка");
    }
  };

  const handleLinkClick = (record: children) => {
    navigate(`/childrens/${record.id}`);
  };

  const handleEdit = (record: children) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      attributes: {
        first_name: record.attributes.first_name,
        last_name: record.attributes.last_name,
        patronymic: record.attributes.patronymic,
        date_of_birth: dayjs(record.attributes.date_of_birth),
        group_id: record.relationships?.group?.data?.id || '',
        kindergarten_title : record.attributes.kindergarten_title
      },
    });
    setIsModalOpen(true);
  };
 

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const updatedChild: children = {
        id: currentRecord?.id || '',
        type: 'children',
        attributes: {
          ...currentRecord?.attributes,
          first_name: values.attributes.first_name,
          last_name: values.attributes.last_name,
          patronymic: values.attributes.patronymic,
          date_of_birth: values.attributes.date_of_birth.format('YYYY-MM-DD'),
          group_title: currentRecord?.attributes.group_title || '',
          kindergarten_title: values.attributes.kindergarten_title || '',
        },
        relationships: {
          group: {
            data: {
              id: values.attributes.group_id,
              type: "group"
            }
          }
        }
      };

      const updatedData: ListChild = {
        ...childData,
        data: childData.data.map(child => 
          child.id === currentRecord?.id ? updatedChild : child
        )
      };

      localStorage.setItem('children', JSON.stringify(updatedData));
      setChildData(updatedData);
      message.success("Данные успешно обновлены");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Ошибка при обновлении данных");
    }


  };  const columns: TableProps<children>["columns"] = [
    {
      title: "Имя",
      dataIndex: ["attributes", "first_name"],
      key: "first_name",
      sorter: (a, b) => a.attributes.first_name.localeCompare(b.attributes.first_name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Фамилия",
      dataIndex: ["attributes", "last_name"],
      key: "last_name",
      sorter: (a, b) => a.attributes.last_name.localeCompare(b.attributes.last_name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Отчество",
      dataIndex: ["attributes", "patronymic"],
      key: "patronymic",
      sorter: (a, b) => a.attributes.patronymic.localeCompare(b.attributes.patronymic),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Дата рождения",
      dataIndex: ["attributes", "date_of_birth"],
      key: "date_of_birth",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Группа",
      dataIndex: ["attributes", "group_title"],
      key: "group",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Детский сад",
      dataIndex: ["attributes", "kindergarten_title"],
      key: "kindergarten_title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
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
      {isLoading && <Result title="Загрузка данных..." />}
      {childData.data.length > 0 ? (
        <Table<children>
          columns={columns}
          dataSource={childData.data}
          rowKey={(record) => record.id}
          loading={isLoading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Всего ${total} записей`,
          }}
        />
      ) : (
        <Result title="Нет данных" />
      )}

      <Modal
        title="Редактировать запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout={formLayout}>
          <Form.Item
            label="Имя"
            name={["attributes", "first_name"]}
            rules={[{ required: true, message: "Пожалуйста, введите имя" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name={["attributes", "last_name"]}
            rules={[{ required: true, message: "Пожалуйста, введите фамилию" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name={["attributes", "patronymic"]}
            rules={[{ required: true, message: "Пожалуйста, введите отчество" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Дата рождения"
            name={["attributes", "date_of_birth"]}
            rules={[{ required: true, message: "Пожалуйста, выберите дату" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Группа"
            name={["attributes", "group_id"]}
            rules={[{ required: true, message: "Пожалуйста, выберите группу" }]}
          >
            <Select>
              {groups.map(group => (
                <Select.Option key={group.id} value={group.id}>
                  {group.attributes.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Детский сад"
            name={["attributes", "kindergarten_title"]}
            rules={[{ required: true, message: "Пожалуйста, выберите Детский сад" }]}
          >
            <Select>
              {kindergartens.map(kindergarten => (
                <Select.Option key={kindergarten.id}>
                  {kindergarten.attributes.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildTable;