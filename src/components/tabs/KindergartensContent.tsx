
import TableKindergarten from "../tables/TableKindergarte";
import { Button, message, Modal } from "antd";
import {  useState } from "react";
import { Form, Input } from "antd";
import { useKindergartens } from "../../hooks/usekindergarten";
import { KindergartenData } from "../../types/kindergartens.type";

type LayoutType = Parameters<typeof Form>[0]["layout"];

/**
 * Компонент для отображения информации о детск их садах
 */

export const KindergartenContent = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const { addKindergartenMutation } = useKindergartens();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const onFinish = async (values: KindergartenData) => {
    try {
      await addKindergartenMutation.mutateAsync(values);
      message.success('Детский сад успешно добавлен');
      form.resetFields(); // Reset the form fields after successful submission
      setRefreshTable((prev) => !prev);
    } catch (error) {
      message.error('Ошибка при добавлении детского сада');
    }
  };

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
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
      <h1 className="mt-4">Детские сады</h1>
      {/* Содержимое страницы детских садов */}
      

      <div className="pt-5">
        <Button
          className="mb-5 float-end"
          color="default"
          variant="solid"
          onClick={showModal}
        >
          Добавить
        </Button>
        <TableKindergarten refreshTable={refreshTable}  />
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
          name={['attributes', 'title']}
          rules={[{ required: true, message: 'Пожалуйста, введите название детского сада' }]}
          >
            <Input placeholder="Название" />
          </Form.Item >
          <Form.Item label="Адрес" 
          name={['attributes', 'address']}
          rules={[{ required: true, message: 'Пожалуйста, введите адрес детского сада' }]}
          >
            <Input placeholder="Адрес" />
          </Form.Item>
          <Form.Item>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};