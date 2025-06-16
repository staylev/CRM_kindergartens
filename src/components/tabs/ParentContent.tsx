import { Button, Form, Input, Modal, Select } from "antd";
import { useState, useEffect } from "react";
import ParentTable from "../tables/ParentTable";

type LayoutType = Parameters<typeof Form>[0]["layout"];

export const ParentContent = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childrenOptions, setChildrenOptions] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = () => {
    const childrenData = localStorage.getItem("children");
    if (!childrenData) return;
  
    try {
      const parsedData = JSON.parse(childrenData);
      const childrenList = parsedData.data || parsedData;
  
      setChildrenOptions(
        childrenList.map((child: any) => ({
          id: child.id,
          last_name: child.attributes?.last_name || "Без фамилии"
        }))
      );
    } catch (e) {
      console.error("Ошибка парсинга детей", e);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const parents = localStorage.getItem('parents') ? JSON.parse(localStorage.getItem('parents')!) : [];
      
      const newParent = { 
        ...values, 
    
        children_ids: values.children || [], // Сохраняем только ID детей как масси
      };
      
      localStorage.setItem('parents', JSON.stringify([...parents, newParent]));
      setIsModalOpen(false);
      form.resetFields();
   
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Родители</h1>
      <div className="pt-5">
        <Button
          className="mb-5 float-end"
          color="default"
          variant="solid"
          onClick={showModal}
        >
          Добавить
        </Button>
        <ParentTable refreshTable={refreshKey} />
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
          initialValues={{ layout: formLayout }}
          onValuesChange={({ layout }) => layout && setFormLayout(layout)}
        >
          <Form.Item
            label="Telegram ID"
            name="tg"
            rules={[
              { required: true, message: "Пожалуйста, введите Telegram ID" },
            ]}
          >
            <Input placeholder="Telegram ID" />
          </Form.Item>
          <Form.Item
            label="Имя"
            name="frist_name"
            rules={[{ required: true, message: "Пожалуйста, введите имя" }]}
          >
            <Input placeholder="Имя" />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name="last_name"
            rules={[{ required: true, message: "Пожалуйста, введите фамилию" }]}
          >
            <Input placeholder="Фамилия" />
          </Form.Item>
          <Form.Item
            label="Телефон"
            name="number_phone"
            rules={[{ required: true, message: "Пожалуйста, введите телефон" }]}
          >
            <Input type="tel" placeholder="Телефон" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите электронную почту",
              },
            ]}
          >
            <Input type="email" placeholder="Электронная почта" />
          </Form.Item>
          <Form.Item
            label="Дети"
            name="children"
            rules={[
              { required: true, message: "Пожалуйста, добавьте ребёнка" },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              optionFilterProp="label"
            >
              {childrenOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.last_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};