import { useState } from "react";
import { DatePicker, Form, Select } from "antd";
import { useChild } from "../../hooks/useChild";
import { ChildData } from "../../types/children.types";
import { Button, Input, message, Modal } from "antd";
import { useGroups } from "../../hooks/useGroup";
import ChildTable from "../tables/ChildTable";
import dayjs from 'dayjs';
type LayoutType = Parameters<typeof Form>[0]["layout"];
/**
 * Компонент для отображения информации о группах
 */
export const ChildrenContent = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const { addChildMutation, ChildListMutation } = useChild();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const onFinish = async (values: ChildData) => {
    try {
      await addChildMutation.mutateAsync(values);
      message.success('Ребёнок успешно добавлен');
      form.resetFields();
      setRefreshTable((prev) => !prev);
      ChildListMutation.mutate();
    } catch (error) {
      message.error('Ошибка при добавлении ребёнка');
    }
  };
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { GroupListMutation } = useGroups()

  const showModal = () => {
    setIsModalOpen(true);
    GroupListMutation.mutate();
  };
  
  const handleOk = () => {
    const values = form.getFieldsValue();
    if (!values.attributes?.first_name || !values.attributes?.last_name || !values.attributes?.patronymic || !values.attributes?.date_of_birth || !values.attributes?.group_id) {
      message.error('Пожалуйста, заполните все поля');
      return; // Прерываем выполнение функции, если какое-то поле не заполнено
    }
    form.submit(); 
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

 
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Дети</h1>
      <div className="pt-5">
        <Button
          className="mb-5 float-end"
          color="default"
          variant="solid"
          onClick={showModal}
        >
          Добавить
        </Button>
        <ChildTable refreshTable={refreshTable} />
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
          onFinish={onFinish}
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
        >
          <Form.Item
            label="Имя"
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
            <Input placeholder="отчество" />
          </Form.Item>
          <Form.Item
            label="Дата рождения"
            name={["attributes", "date_of_birth"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите дату рождения ребёнка",
              },
            ]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : "",
            })}
          >
            <DatePicker
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
};
