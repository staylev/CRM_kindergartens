import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Result, Select, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { events } from '../../types/event.type';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TablechildProps {
  refreshTable: boolean;
}

type LayoutType = Parameters<typeof Form>[0]["layout"];

const EventTable: React.FC<TablechildProps> = ({ refreshTable }) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [data, setData] = useState<events[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kindergartens, setkinddergartens] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<events | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
    loadGroupsAndChildren();
  }, [refreshTable]);

  const loadEvents = () => {
    try {
      setLoading(true);
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      setData(storedEvents);
      setLoading(false);
    } catch (err) {
      setError('Ошибка при загрузке данных');
      setLoading(false);
    }
  };

  const loadGroupsAndChildren = () => {
    const storedkinddergartens= JSON.parse(localStorage.getItem('kindergartens') || '[]');
    setkinddergartens(storedkinddergartens);
  };

  const handleDelete = (id: string) => {
    try {
      const updatedEvents = data.filter(event => event.id !== id);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      message.success(`Запись ${id} удалена`);
      loadEvents();
    } catch (error) {
      message.error("Ошибка при удалении мероприятия");
    }
  };

  const handleEdit = (record: events) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      attributes: {
        title: record.attributes.title,
        description: record.attributes.description,
        datetime_start: record.attributes.datetime_start,
        datetime_end: record.attributes.datetime_end,
        kinddergarten_id: record.attributes.kinddergarten_id,
        kindergarten_title : record.attributes.kindergarten_title
      }
    });
    setIsModalOpen(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  
  const handleLinkClick = (record: events) => {
    navigate(`/events/${record.id}`);
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      const updatedEvent = {
        ...currentRecord,
        attributes: {
          ...currentRecord?.attributes,
          title: values.attributes.title,
          description: values.attributes.description,
          datetime_start: new Date(values.attributes.datetime_start),
          datetime_end: new Date(values.attributes.datetime_end),
          kinddergarten_id: values.attributes.group_id,
          kindergarten_title: values.attributes.kindergarten_title || '',
        }
      };

      const updatedEvents = data.map(event => 
        event.id === currentRecord?.id ? updatedEvent : event
      );

      localStorage.setItem('events', JSON.stringify(updatedEvents));
      message.success("Данные успешно обновлены");
      setIsModalOpen(false);
      loadEvents();
      form.resetFields();
    } catch (error) {
      message.error("Ошибка при обновлении данных");
    }
  };

  const columns: TableProps<events>["columns"] = [
    {
      title: "Название",
      dataIndex: ["attributes", "title"],
      key: "title",
      sorter: (a, b) => a.attributes.title.localeCompare(b.attributes.title),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Описание",
      dataIndex: ["attributes", "description"],
      key: "description",
      sorter: (a, b) => a.attributes.description.localeCompare(b.attributes.description),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Дата начала",
      dataIndex: ["attributes", "datetime_start"],
      key: "datetime_start",
      sorter: (a, b) =>
        new Date(a.attributes.datetime_start).getTime() - new Date(b.attributes.datetime_start).getTime(),
      render: (text) => (
        <a>
          {new Date(text).toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </a>
      ),
    },
    {
      title: "Дата окончания",
      dataIndex: ["attributes", "datetime_end"],
      key: "datetime_end",
      sorter: (a, b) =>
        new Date(a.attributes.datetime_end).getTime() - new Date(b.attributes.datetime_end).getTime(),
      render: (text) => (
        <a>
          {new Date(text).toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </a>
      ),
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
      {loading && <Result title="Загрузка данных..." />}
      {error && (
        <Result
          status="error"
          title="Ошибка загрузки"
          subTitle={error}
        />
      )}
      {data && (
        <Table<events>
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          loading={loading}
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
      )}

      <Modal
        title="Редактировать запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onValuesChange={({ layout }) => setFormLayout(layout)}
        >
          <Form.Item
            label="Название"
            name={["attributes", "title"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите название мероприятия",
              },
            ]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Описание"
            name={["attributes", "description"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите описание мероприятия",
              },
            ]}
          >
            <Input placeholder="Описание" />
          </Form.Item>
          
          <Form.Item
            label="Дата начала"
            name={["attributes", "datetime_start"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите дату начала мероприятия",
              },
            ]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : "",
            })}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime
              onChange={(date) => {
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_start: dateWithTimeZone,
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_start: null,
                    },
                  });
                }
              }}
            />
          </Form.Item>
         
          <Form.Item
            label="Дата окончания"
            name={["attributes", "datetime_end"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите дату окончания мероприятия",
              },
            ]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : "",
            })}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime
              onChange={(date) => {
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_end: dateWithTimeZone,
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_end: null,
                    },
                  });
                }
              }}
            />
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

export default EventTable;