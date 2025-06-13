import { useState, useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";
import TableKindergarten from "../tables/TableKindergarten";

export const KindergartenContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kindergartens, setKindergartens] = useState(JSON.parse(localStorage.getItem("kindergartens")??"[]"));
  const [form] = Form.useForm();
 
  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem("kindergartens", JSON.stringify(kindergartens));
  }, [kindergartens]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    const newRecord = {
      id: Date.now().toString(),
      attributes: values.attributes,
    };
    setKindergartens((prev: any) => [...prev, newRecord]);
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Детские сады</h1>
      <div className="pt-5">
        <Button className="mb-5 float-end" onClick={showModal}>
          Добавить
        </Button>
        <TableKindergarten data={kindergartens} setData={setKindergartens} />
      </div>

      {/* Модальное окно добавления */}
      <Modal
        title="Добавить запись"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Название" name={['attributes', 'title']} rules={[{ required: true }]}>
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item label="Адрес" name={['attributes', 'address']} rules={[{ required: true }]}>
            <Input placeholder="Адрес" />
          </Form.Item>
          <Form.Item label="Основан в" name={['attributes', 'founded_by']} rules={[{ required: true }]}>
            <Input placeholder="Основан в " />
          </Form.Item>
          <Form.Item label="Вместимость" name={['attributes', 'сapacity']} rules={[{ required: true }]}>
            <Input placeholder="Вместимость" />
          </Form.Item>
          <Form.Item label="Директор" name={['attributes', 'director']} rules={[{ required: true }]}>
            <Input placeholder="Директор" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};