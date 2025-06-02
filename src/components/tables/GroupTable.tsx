import { Button, Form, Input, message, Modal, Popconfirm, Result, Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { Groups } from "../../types/Groups..type";
import { useGroups } from "../../hooks/useGroup";
import { useKindergartens } from "../../hooks/usekindergarten";
import { useNavigate } from "react-router-dom";
 
interface TableGroupProps {
    refreshTable: boolean; // Указываем, что компонент принимает пропс refreshTable
  }
  
  type LayoutType = Parameters<typeof Form>[0]["layout"];
  
  const GroupTable: React.FC<TableGroupProps> = ({ refreshTable }) => {
    const {
      GroupListMutation,
      isPending,
      isError,
      isSuccess,
      transformedData,
      data,
      error,
      deleteGroupMutation,
      UpdateGroupMutation,
    } = useGroups();
  
    const { kindergartensListMutation } = useKindergartens()

    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<Groups | null>(null);
  
 
    // Загрузка данных при монтировании компонента
    useEffect(() => {
      GroupListMutation.mutate();
      kindergartensListMutation.mutate()
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
        await deleteGroupMutation.mutateAsync(id);
        message.success(`Запись ${id} удалена`);
        GroupListMutation.mutate(); // Обновляем данные после удаления
      } catch (error) {
        message.error("Ошибка при удалении группы");
      }
    };
  
    // Редактирование записи
    const handleEdit = (record: Groups) => {
      setCurrentRecord(record); // Устанавливаем текущую запись для редактирования
      form.setFieldsValue({
        attributes: {
          title: record.attributes.title,
        },
      }); // Заполняем форму данными записи
      showModal(); // Открываем модальное окно
    };
    
    const navigate = useNavigate();

    const handleLinkClick = (record: Groups) => {
      navigate(`/groups/${record.id}`);
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
        await UpdateGroupMutation.mutateAsync({
          Update: {
            attributes: {
              title: form.getFieldValue(["attributes", "title"]),
              kindergarten_title: form.getFieldValue(["attributes", "kindergarten_title"]),
            },
            id: currentRecord?.id || "",
            type: "group"
          },
          id: currentRecord?.id || ""
        });
        message.success("Данные успешно обновлены");
        setIsModalOpen(false);
        GroupListMutation.mutate();
        form.resetFields();
      } catch (error) {
        message.error("Ошибка при обновлении данных");
      }
    };  
    // Колонки таблицы
    const columns: TableProps<Groups>["columns"] = [
      {
        title: "Название",
        dataIndex: ["attributes", "title"],
        key: "name",
        sorter: (a, b) => a.attributes.title.localeCompare(b.attributes.title),
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Детский сад",
        dataIndex: ["attributes", "kindergarten_title"],
        key: "address",
        sorter: (a, b) => a.attributes.kindergarten_title.localeCompare(b.attributes.kindergarten_title),
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
          <Result status="error" title="Ошибка загрузки" subTitle={error?.message} />
        )}
        {isSuccess && transformedData && (
          <Table<Groups>
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
                message: "Пожалуйста, введите название группы",
              },
            ]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
             label="Детский сад"
             name={["attributes", "kindergarten_id"]}
             rules={[
               {
                 required: true,
                 message: "Пожалуйста, выберите детский сад",
               },
             ]}
          >
            <Select
              style={{ width: 200 }}
              optionFilterProp="label"
              defaultValue={currentRecord?.attributes.kindergarten_title}
              disabled={true}
              >
              {kindergartensListMutation.data?.data && Array.isArray(kindergartensListMutation.data.data)
              ? kindergartensListMutation.data.data.map((item) => (
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
  };  export default GroupTable;