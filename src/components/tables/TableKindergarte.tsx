import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Result, Table } from "antd";
import type { TableProps } from "antd";
import { Button, message, Popconfirm } from "antd";
import { useKindergartens } from "../../hooks/usekindergarten";
import { Kindergartens } from "../../types/kindergartens.type";
import { useNavigate } from "react-router-dom";

interface TableKindergartenProps {
  refreshTable: boolean; // Указываем, что компонент принимает пропс refreshTable
}

type LayoutType = Parameters<typeof Form>[0]["layout"];

const TableKindergarten: React.FC<TableKindergartenProps> = ({ refreshTable }) => {
  const {
    kindergartensListMutation,
    isPending,
    isError,
    isSuccess,
    data,
    error,
    deleteKindergartenMutation,
    UpdateKindergartenMutation,
  } = useKindergartens();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Kindergartens | null>(null);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    kindergartensListMutation.mutate();
  }, []);
 
  // Обновление данных при изменении refreshTable
  useEffect(() => {
    if (refreshTable) {
      kindergartensListMutation.mutate();
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
      await deleteKindergartenMutation.mutateAsync(id);
      message.success(`Запись ${id} удалена`);
      kindergartensListMutation.mutate(); // Обновляем данные после удаления
    } catch (error) {
      message.error("Ошибка при удалении детского сада");
    }
  };

  const navigate = useNavigate()

  const handleLinkClick = (record: Kindergartens) => {
    navigate(`/Kindergartens/${record.id}`, {
      state: { kindergartenData: record } // Передаем данные записи через состояние навигации
    });
  };


  // Редактирование записи
  const handleEdit = (record: Kindergartens) => {
    setCurrentRecord(record); // Устанавливаем текущую запись для редактирования
    form.setFieldsValue({
      attributes: {
        title: record.attributes.title,
        address: record.attributes.address,
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
      await UpdateKindergartenMutation.mutateAsync({
        id: currentRecord?.id || "", // ID текущей записи
        Update: {
          type: "kindergarten", // Тип данных (если требуется)
          attributes: {
            title: form.getFieldValue(["attributes", "title"]), // Новое название
            address: form.getFieldValue(["attributes", "address"]), // Новый адрес
          },
          id: currentRecord?.id || "", // ID текущей записи
        },
      });
      message.success("Данные успешно обновлены");
      setIsModalOpen(false); // Закрываем модальное окно
      kindergartensListMutation.mutate(); // Обновляем данные после редактирования
       // Выводим сообщение об успешном обновлении
      form.resetFields(); // Сбрасываем форму
    } catch (error) {
      message.error("Ошибка при обновлении данных");
    }
  };

  // Колонки таблицы
  const columns: TableProps<Kindergartens>["columns"] = [
    {
      title: "Название",
      dataIndex: ["attributes", "title"],
      key: "name",
      sorter: (a, b) => a.attributes.title.localeCompare(b.attributes.title),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Адрес",
      dataIndex: ["attributes", "address"],
      key: "address",
      sorter: (a, b) => a.attributes.address.localeCompare(b.attributes.address),
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <div className="m-0">
          <Button type="link" onClick={() => handleEdit(record)}>
            Изменить
          </Button>
          <Button type="link" onClick={() => handleLinkClick(record)}> {/* Передаем всю запись */}
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
      {isSuccess && data && (
        <Table<Kindergartens>
          columns={columns}
          dataSource={data.data}
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
                message: "Пожалуйста, введите название детского сада",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Адрес"
            name={["attributes", "address"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите адрес детского сада",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableKindergarten;