import { useState } from "react";
import { Form, Input, Select, Button, message, Modal } from "antd";
import GroupTable from "../tables/GroupTable";
import { Groups, ListGroups } from "../../types/Groups..type";

const GroupsContent = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<"horizontal" | "vertical">("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = (values: any) => {
    const newId = Math.random().toString(36).substr(2, 9); // Генерация ID
    const groupData: Groups = {
      relationships: {},
      type: "group",
      attributes: {
        title: values.attributes.title,
        kindergarten_title: values.attributes.kindergarten_title,
        type_group: values.attributes.type_group,
        description: "",
        count_children: 0,
        number_classroom: 0
      },
      id: newId,
    };

    const storedData = localStorage.getItem("groups");
    let parsedData: ListGroups = {
      included: [],
      meta: {
        count: 0,
        totalPages: 1,
      },
      data: [],
    };

    if (storedData) {
      parsedData = JSON.parse(storedData);
    }

    parsedData.data.push(groupData);
    parsedData.meta.count = parsedData.data.length;

    localStorage.setItem("groups", JSON.stringify(parsedData));
    message.success("Группа успешно добавлена");
    form.resetFields();
    setIsModalOpen(false);
    setRefreshTable((prev) => !prev);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Группы</h1>
      <div className="pt-5">
        <Button
          className="mb-5 float-end"
          color="default"
          variant="solid"
          onClick={showModal}
        >
          Добавить
        </Button>
        <GroupTable refreshTable={refreshTable} />
      </div>

      <Modal
        title="Добавить запись"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form
          form={form}
          layout={formLayout}
          onFinish={onFinish}
          initialValues={{ layout: formLayout }}
          onValuesChange={({ layout }) => setFormLayout(layout)}
        >
          <Form.Item
            label="Название"
            name={["attributes", "title"]}
            rules={[{ required: true, message: "Введите название группы" }]}
          >
            <Input placeholder="Название" />
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
            <Select  defaultValue={"Выберите тип группы"}>
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

export default GroupsContent;