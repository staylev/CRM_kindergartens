import { useState } from "react";
import { Form, Input, Select } from "antd";
import {  GroupData } from "../../types/Groups..type";
import { Button, message, Modal } from "antd";
import GroupTable from "../tables/GroupTable";
import { useGroups } from "../../hooks/useGroup";
import { useKindergartens } from "../../hooks/usekindergarten";
 
type LayoutType = Parameters<typeof Form>[0]["layout"];
/**
 * Компонент для отображения информации о группах
 */
export const GroupsContent = () => {
  const [ refreshTable, setRefreshTable] = useState(false);
  const { addKGroupMutation, GroupListMutation } = useGroups();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const onFinish = async (values: GroupData) => {
    try {
      await addKGroupMutation.mutateAsync(values);
      message.success('Группа успешно добавлена');
      form.resetFields();
      setRefreshTable((prev) => !prev);
      GroupListMutation.mutate();
    } catch (error) {
      message.error('Ошибка при добавлении группы');
    }
  };
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { kindergartensListMutation } = useKindergartens()

  const showModal = () => {
    setIsModalOpen(true);
    kindergartensListMutation.mutate();
  };
  
  const handleOk = () => {
    form.submit(); 
    setIsModalOpen(false);
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
          onFinish={onFinish}
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
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
}; 