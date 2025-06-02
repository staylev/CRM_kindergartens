import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Result, Select, Table, TableProps } from "antd";
import { useChild } from "../../hooks/useChild";
import { useGroups } from "../../hooks/useGroup";
import { useEffect, useState } from "react";
import { children } from "../../types/children.types";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";



interface TablechildProps {
    refreshTable: boolean; // Указываем, что компонент принимает пропс refreshTable
  }
  
  type LayoutType = Parameters<typeof Form>[0]["layout"];
  
  const ChildTable: React.FC<TablechildProps> = ({ refreshTable }) => {
  const navigate = useNavigate();
    const {
      ChildListMutation,
      isPending,
      isError,
      isSuccess,
      transformedData,
      data,
      error,
      deleteChildMutation,
      UpdateChildMutation,
    } = useChild();
  
    const { GroupListMutation } = useGroups()

    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<children | null>(null);
  
 
    // Загрузка данных при монтировании компонента
    useEffect(() => {
      ChildListMutation.mutate();
    }, []);
   
    // Обновление данных при изменении refreshTable
    useEffect(() => {
      if (refreshTable) {
        GroupListMutation.mutate();
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
        await deleteChildMutation.mutateAsync(id);
        message.success(`Запись ${id} удалена`);
        ChildListMutation.mutate(); // Обновляем данные после удаления
      } catch (error) {
        message.error("Ошибка при удалении ребёнка");
      }
    };

    const handleLinkClick = (record: children) => {
      navigate(`/childrens/${record.id}`);
    };
  
    // Редактирование записи
    const handleEdit = (record: children) => {
      setCurrentRecord(record); // Устанавливаем текущую запись для редактирования
      form.setFieldsValue({
        attributes: {
          first_name: record.attributes.first_name,
          last_name: record.attributes.last_name,
          patronymic: record.attributes.patronymic,
          date_of_birth: record.attributes.date_of_birth,
        },
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
  
    // Сохранение данных формы
    const handleOk = async () => {
      try {
        await UpdateChildMutation.mutateAsync({
          Update: {
            attributes: {
              first_name: form.getFieldValue(["attributes", "first_name"]),
              last_name: form.getFieldValue(["attributes", "last_name"]),
              patronymic: form.getFieldValue(["attributes", "patronymic"]),
              date_of_birth: form.getFieldValue(["attributes", "date_of_birth"]),
              group_id:  form.getFieldValue(["attributes", "group_id"]),
            },
            id: currentRecord?.id || "",
            type: "child"
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
    const columns: TableProps<children>["columns"] = [
      {
        title: "имя",
        dataIndex: ["attributes", "first_name"],
        key: "first_name",
        sorter: (a, b) =>
          a.attributes.first_name.localeCompare(b.attributes.first_name),
        render: (text) => (
          <a onClick={() => navigate(`/childrens/${text}`)}>{text}</a>
        ),
      },
      {
        title: "фамилия",
        dataIndex: ["attributes", "last_name"],
        key: "last_name",
        sorter: (a, b) =>
          a.attributes.last_name.localeCompare(b.attributes.last_name),
        render: (text) => <a>{text}</a>,
      },
      {
        title: "отчество",
        dataIndex: ["attributes", "patronymic"],
        key: "patronymic",
        sorter: (a, b) =>
          a.attributes.patronymic.localeCompare(b.attributes.patronymic),
        render: (text) => <a>{text}</a>,
      },
      {
        title: "дата рождения",
        dataIndex: ["attributes", "date_of_birth"],
        key: "date_of_birth",
      },
      {
        title: "группа",
        dataIndex: ["attributes", "group_title"],
        key: "address",
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
        {isPending && <Result title="Загрузка данных..." />}
        {isError && (
          <Result
            status="error"
            title="Ошибка загрузки"
            subTitle={error?.message}
          />
        )}
        {isSuccess && transformedData && (
          <Table<children>
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
              label="имя"
              name={["attributes", "first_name"]}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите имя ребёнка",
                },
              ]}
            >
              <Input placeholder="Имя" />
            </Form.Item>
            <Form.Item
              label="Фамилия"
              name={["attributes", "last_name"]}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите фамилию ребёнка",
                },
              ]}
            >
              <Input placeholder="Фамилия" />
            </Form.Item>
            <Form.Item
              label="Отчество"
              name={["attributes", "patronymic"]}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите отчество ребёнка",
                },
              ]}
            >
              <Input placeholder="Отчество" />
            </Form.Item>
            <Form.Item
              label="Дата рождения"
              name={["attributes", "date_of_birth"]}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите дату рождения",
                },
              ]}
              getValueProps={(value) => ({
                value: value ? dayjs(value) : "",
              })}
            >
              <DatePicker placeholder="Дата рождения" 
           format="YYYY-MM-DD"
           onChange={(date, dateString) => {
             // Check if date is valid
             if (date) {
               form.setFieldsValue({
                 attributes: {
                   ...form.getFieldValue("attributes"),
                   date_of_birth: dateString, // Set the formatted date string
                 },
               });
             } else {
               console.error("No date selected");
             }
           }}
              />
            </Form.Item>
            <Form.Item
              label="Группа"
              name={["attributes", "group_id"]}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите группу ребёнка",
                },
              ]}
            >
              <Select
                style={{ width: 200 }}
                optionFilterProp="label"
                defaultValue={currentRecord?.attributes.group_title}
              >
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

    export default ChildTable;
