import { Button, Form, Input, Modal, Popconfirm, Select, Table, TableProps } from "antd";
import { useChild } from "../../hooks/useChild";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

 

interface TablechildProps {
    refreshTable: boolean; // Указываем, что компонент принимает пропс refreshTable
  }
  
  type LayoutType = Parameters<typeof Form>[0]["layout"];
  
  const ParentTable: React.FC<TablechildProps> = ({   }) => {
  
    // const {
    //   EventListMutation,
    //   isPending,
    //   isError,
    //   isSuccess,
    //   transformedData,
    //   data,
    //   error,
    //   deleteEventMutation,
    //   UpdateEventMutation,
    // } = useEvent();
  
    const {ChildListMutation } = useChild()

    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [currentRecord, setCurrentRecord] = useState<events | null>(null);
  
 
    // Загрузка данных при монтировании компонента
    // useEffect(() => {
    //   EventListMutation.mutate();
    // }, []);
   
    // Обновление данных при изменении refreshTable
    // useEffect(() => {
    //   if (refreshTable) {
    //     EventListMutation.mutate();
    //   }
    // }, [refreshTable]);
  
    // Логирование данных после успешной загрузки
    // useEffect(() => {
    //   if (isSuccess) {
    //     console.log("Данные успешно загружены:", data);
    //   }
    // }, [isSuccess, data]);
  
    // Логирование ошибки при загрузке данных
    // useEffect(() => {
    //   if (isError) {
    //     console.error("Ошибка при загрузке данных:", error);
    //   }
    // }, [isError, error]);
  
    // Удаление записи
    // const handleDelete = async (id: string) => {
    //   // try {
    //   //   await deleteEventMutation.mutateAsync(id);
    //   //   message.success(`Запись ${id} удалена`);
    //   //   ChildListMutation.mutate(); // Обновляем данные после удаления
    //   // } catch (error) {
    //   //   message.error("Ошибка при удалении ребёнка");
    //   // }
    // };
  
    // Редактирование записи
    // const handleEdit = (record: events) => {
    //   setCurrentRecord(record); // Устанавливаем текущую запись для редактирования
    //   form.setFieldsValue({
    //     attributes: {
    //       title: record.attributes.title,
    //       description: record.attributes.description,
    //       datetime_start: record.attributes.datetime_start,
    //       datetime_end: record.attributes.datetime_end,
    //       group_title: record.attributes.group_title,
    //       child_last_name: record.attributes.child_last_name,
    //     }
    //   }); // Заполняем форму данными записи
    //   showModal(); // Открываем модальное окно
    // };

    const handleEdit = ()=>{
      showModal();
      ChildListMutation.mutate()// Открываем модальное окно
    };
  
    // Открытие модального окна
    const showModal = () => {
      setIsModalOpen(true);
    };
    
    const navigate = useNavigate();

    const handleLinkClick = (id: string) => {
      navigate(`/parents/${id}`);
    };
  

    // Закрытие модального окна
    const handleCancel = () => {
      setIsModalOpen(false);
      form.resetFields(); // Сбрасываем форму
    };
  
    // Сохранение данных формы
    const handleOk = async () => {
      // try {
      //   await UpdateEventMutation.mutateAsync({
      //     Update: {
      //         attributes: {
      //           title: form.getFieldValue(["attributes", "title"]),
      //           description: form.getFieldValue(["attributes", "description"]),
      //           datetime_start: form.getFieldValue(["attributes", "datetime_start"]),
      //           datetime_end: form.getFieldValue(["attributes", "datetime_end"]),
      //           group_id: form.getFieldValue(["attributes", "group_id"]),
      //           child_id: form.getFieldValue(["attributes", "child_id"]),
      //         },
      //         id: currentRecord?.id || "",
      //         type: "event",
      //     },
      //     id: currentRecord?.id || ""
      //   });
      //   message.success("Данные успешно обновлены");
      //   setIsModalOpen(false);
      //   ChildListMutation.mutate();
      //   form.resetFields();
      // } catch (error) {
      //   message.error("Ошибка при обновлении данных");
      // }
    };
     interface ParentsAttributes {
      tg_id: string;
      username: string;
      frist_name: string;
      last_name: string;
      phone: string;
      email: string;
      chiild_last_name: string;
    }

    const dataSource: ParentsAttributes[] = [
      {
        tg_id: "123456789",
        username: "user123",
        frist_name: "John",
        last_name: "Doe",
        phone: "1234567890",
        email: "john.doe@example.com",
        chiild_last_name: "Doe",
      },
      {
        tg_id: "987654321",
        username: "user456",
        frist_name: "Jane",
        last_name: "Smith",
        phone: "9876543210",
        email: "jane.smith@example.com",
        chiild_last_name: "Smith",
      },
      {
        tg_id: "111111111",
        username: "user789",
        frist_name: "Alice",
        last_name: "Johnson",
        phone: "1111111111",
        email: "alice.johnson@example.com",
        chiild_last_name: "Johnson",
      },
    ]

    //   {  
    // Колонки таблицы
    const columns: TableProps<ParentsAttributes>["columns"] = [
      // {
      //   title: "Название",
      //   dataIndex: ["attributes", "title"],
      //   key: "title",
      //   sorter: (a, b) => a.attributes.title.localeCompare(b.attributes.title),
      //   render: (text) => <a>{text}</a>,
      // },
      // {
      //   title: "Описание",
      //   dataIndex: ["attributes", "description"],
      //   key: "last_name",
      //   sorter: (a, b) => a.attributes.title.localeCompare(b.attributes.description),
      //   render: (text) => <a>{text}</a>,
      // },
      
 
      // {
      //   title: "Фамилия ребёнка",
      //   dataIndex: ["attributes", "child_last_name"],
      //   key: "child_last_name",
      //   render: (text) => <a>{text}</a>,
      // },
      // {
      //   title: "группа",
      //   dataIndex: ["attributes", "group_title"],
      //   key: "group_title",
      //   render: (text) => <a>{text}</a>,
      // },
      {
        title: 'tg пользователя',
        dataIndex: 'tg_id',
        key: 'tg_id',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Имя пользователя',
        dataIndex: 'username',
        key: 'username',
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
        dataIndex: 'phone',
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
        dataIndex: 'chiild_last_name',
        key: 'chiild_last_name',
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Действия",
        key: "action",
        render: (_,  ) => (
          <div className="m-0">
            <Button type="link" onClick={() => handleEdit()}> 
              Изменить
            </Button>
            <Button type="link" onClick={() => handleLinkClick("1")}> 
             Подробнее
            </Button>
            <Popconfirm
              title="Удаление записи"
              description="Вы уверены, что хотите удалить запись?"
              // onConfirm={() => handleDelete(record.id)}{/*record.id*/}
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
        {/* {isPending && <Result title="Загрузка данных..." />}
        {isError && (
          <Result
            status="error"
            title="Ошибка загрузки"
            subTitle={error?.message}
          />
        )}
        {isSuccess && transformedData && ( */}
          <Table<ParentsAttributes>
            columns={columns}
            dataSource={dataSource}
            // rowKey={(record) => record.id}
            // loading={isPending}
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
        title="Добавить запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form
          onFinish={()=>{}}///onFinish
          layout={formLayout}
          form={form}
          initialValues={{ layout: setFormLayout }}
          onValuesChange={()=>{}}//onFormLayoutChange
        >
          <Form.Item
            label="Telegram ID"
            // name={["attributes", "tg_id"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите Telegram ID",
              },
            ]}
          >
            <Input placeholder="Telegram ID" />
          </Form.Item>
          <Form.Item
            label="имя пользователя" 
            //name={["attributes", "username"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите имя пользователя",
              },
            ]}
          >
            <Input placeholder="имя пользователя" />
          </Form.Item>
          <Form.Item
            label="Имя"
            // name={["attributes", "patronymic"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите имя "
              },
            ]}
          >
            <Input placeholder="имя" />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            // name={["attributes", "patronymic"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите фамилию "
              },
            ]}
          >
            <Input placeholder="фамилия" />
          </Form.Item>
          <Form.Item
            label="Телефон"
            // name={["attributes", "patronymic"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите телефон "
              },
            ]}
          >
            <Input type="phone" placeholder="телефон" />
          </Form.Item>
          <Form.Item
            label="email"
            // name={["attributes", "patronymic"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите электронную почту "
              },
            ]}
          >
            <Input type="mail" placeholder="электронная почта" />
          </Form.Item>
          <Form.Item
            label="Дети"
            name={["attributes", "group_id"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, добавьте ребёнка",
              },
            ]}
          >
            <Select  mode="multiple" style={{ width: 200 }} optionFilterProp="label">
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
        </Form>
      </Modal>
      </div>
    );

    }

    export default ParentTable;
