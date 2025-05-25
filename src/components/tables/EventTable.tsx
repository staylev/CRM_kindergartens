import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Result, Select, Table, TableProps } from 'antd';
import { useEvent } from '../../hooks/useEvent';
import { useGroups } from '../../hooks/useGroup';
import { useChild } from '../../hooks/useChild';
import { useEffect, useState } from 'react';
import { events } from '../../types/event.type';
import { useNavigate } from 'react-router-dom';

interface TablechildProps {
    refreshTable: boolean; // Указываем, что компонент принимает пропс refreshTable
  }
  
  type LayoutType = Parameters<typeof Form>[0]["layout"];
  
  const EventTable: React.FC<TablechildProps> = ({ refreshTable }) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const {
      EventListMutation,
      isPending,
      isError,
      isSuccess,
      transformedData,
      data,
      error,
      deleteEventMutation,
      UpdateEventMutation,
    } = useEvent();
  
    const { GroupListMutation } = useGroups()
      const {ChildListMutation } = useChild()

    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<events | null>(null);
  
 
    // Загрузка данных при монтировании компонента
    useEffect(() => {
      EventListMutation.mutate();
    }, []);
   
    // Обновление данных при изменении refreshTable
    useEffect(() => {
      if (refreshTable) {
        EventListMutation.mutate();
      }
    }, [refreshTable]);
  
    // Логирование данных после успешной загрузки
    useEffect(() => {
      if (isSuccess) {
        console.log("Данные успешно загружены:", data);
      }
    }, [isSuccess, data]);
  
    // Логирование ошибки при загрузке данных
    useEffect(() => {
      if (isError) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }, [isError, error]);
  
    // Удаление записи
    const handleDelete = async (id: string) => {
      try {
        await deleteEventMutation.mutateAsync(id);
        message.success(`Запись ${id} удалена`);
        ChildListMutation.mutate(); // Обновляем данные после удаления
      } catch (error) {
        message.error("Ошибка при удалении ребёнка");
      }
    };
  
    // Редактирование записи
    const handleEdit = (record: events) => {
      setCurrentRecord(record); // Устанавливаем текущую запись для редактирования
      form.setFieldsValue({
        attributes: {
          title: record.attributes.title,
          description: record.attributes.description,
          datetime_start: record.attributes.datetime_start,
          datetime_end: record.attributes.datetime_end,
          group_title: record.attributes.group_title,
          child_last_name: record.attributes.child_last_name,
        }
      }); // Заполняем форму данными записи
      showModal(); // Открываем модальное окно
    };
  
    // Открытие модального окна
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    // Закрытие модального окна
    const handleCancel = () => {
      setIsModalOpen(false);
      form.resetFields(); // Сбрасываем форму
    };
    
    const navigate = useNavigate();

    const handleLinkClick = (id: string) => {
      navigate(`/events/${id}`);
    };

  
    // Сохранение данных формы
    const handleOk = async () => {
      try {
        await UpdateEventMutation.mutateAsync({
          Update: {
              attributes: {
                title: form.getFieldValue(["attributes", "title"]),
                description: form.getFieldValue(["attributes", "description"]),
                datetime_start: form.getFieldValue(["attributes", "datetime_start"]),
                datetime_end: form.getFieldValue(["attributes", "datetime_end"]),
                group_id: form.getFieldValue(["attributes", "group_id"]),
                child_id: form.getFieldValue(["attributes", "child_id"]),
              },
              id: currentRecord?.id || "",
              type: "event",
          },
          id: currentRecord?.id || ""
        });
        message.success("Данные успешно обновлены");
        setIsModalOpen(false);
        ChildListMutation.mutate();
        form.resetFields();
      } catch (error) {
        message.error("Ошибка при обновлении данных");
      }
    };
    // Колонки таблицы
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
        key: "last_name",
        sorter: (a, b) => a.attributes.title.localeCompare(b.attributes.description),
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Дата начала",
        dataIndex: ["attributes", "datetime_start"],
        key: "datetime_start",
        sorter: (a, b) =>
            a.attributes.datetime_start
              .toISOString()
              .localeCompare(b.attributes.datetime_start.toISOString()),
          render: (text) =>  <a>
          {new Date(text).toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </a>,
   
      },
      {
        title: "Дата окончания",
        dataIndex: ["attributes", "datetime_end"],
        key: "datetime_end",
        sorter: (a, b) =>
            a.attributes.datetime_end
              .toISOString()
              .localeCompare(b.attributes.datetime_end.toISOString()),
          render: (text) =>  <a>
          {new Date(text).toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </a>,
   
      },
      {
        title: "Фамилия ребёнка",
        dataIndex: ["attributes", "child_last_name"],
        key: "child_last_name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "группа",
        dataIndex: ["attributes", "group_title"],
        key: "group_title",
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
            <Button type="link" onClick={() => handleLinkClick(record.id)}>
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
        {isPending && <Result title="Загрузка данных..." />}
        {isError && (
          <Result
            status="error"
            title="Ошибка загрузки"
            subTitle={error?.message}
          />
        )}
        {isSuccess && transformedData && (
          <Table<events>
            columns={columns}
            dataSource={transformedData.data}
            rowKey={(record) => record.id}
            loading={isPending}
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
                // Check if date is valid
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_start: dateWithTimeZone, // Set the formatted date string
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_start: null, // Очищаем значение, если дата не выбрана
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
                // Check if date is valid
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_end: dateWithTimeZone, // Set the formatted date string
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_end: null, // Очищаем значение, если дата не выбрана
                    },
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Фамилия ребёнка"
            name={["attributes", "child_id"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите фамилию ребёнка",
              },
            ]}
          >
           <Select style={{ width: 200 }} optionFilterProp="label">
              {ChildListMutation.data?.data &&
              Array.isArray(ChildListMutation.data.data)
                ? ChildListMutation.data.data.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.attributes.last_name}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>

          <Form.Item
            label="группа"
            name={["attributes", "group_id"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите группу ребёнка",
              },
            ]}
          >
            <Select style={{ width: 200 }} optionFilterProp="label">
              {GroupListMutation.data?.data &&
              Array.isArray(GroupListMutation.data.data)
                ? GroupListMutation.data.data.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.attributes.title}
                    </Select.Option>
                  ))
                : null}
            </Select>
          </Form.Item>
          </Form>
        </Modal>
      </div>
    );

    }

    export default EventTable;
