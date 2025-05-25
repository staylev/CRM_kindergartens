import { Button, Form, Input, Modal, Select } from "antd";
import { useState } from "react";
import { useChild } from "../../hooks/useChild";
import ParentTable from "../tables/ParentTable";

 
type LayoutType = Parameters<typeof Form>[0]["layout"];
/**
 * Компонент для отображения информации о группах
 */
export const ParentContent  = () => {
//   const [refreshTable, setRefreshTable] = useState(false);
  const { ChildListMutation } = useChild();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

//   const onFinish = async (values: ChildData) => {
//     try {
//       await addChildMutation.mutateAsync(values);
//       message.success('Ребёнок успешно добавлен');
//       form.resetFields();
//       setRefreshTable((prev) => !prev);
//       ChildListMutation.mutate();
//     } catch (error) {
//       message.error('Ошибка при добавлении ребёнка');
//     }
//   };
//   const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
//     setFormLayout(layout);
//   };

  const [isModalOpen, setIsModalOpen] = useState(false);
//   const { GroupListMutation } = useGroups()

  const showModal = () => {
    setIsModalOpen(true);
    ChildListMutation.mutate();
  };
  
  const handleOk = () => {
//     const values = form.getFieldsValue();
//     if (!values.attributes?.first_name || !values.attributes?.last_name || !values.attributes?.patronymic || !values.attributes?.date_of_birth || !values.attributes?.group_id) {
//       message.error('Пожалуйста, заполните все поля');
//       return; // Прерываем выполнение функции, если какое-то поле не заполнено
//     }
//     form.submit(); 
//     setIsModalOpen(false);
//   };
  }
  const handleCancel = () => {
    setIsModalOpen(false);
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
        <ParentTable refreshTable={false}  />
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
          onFinish={()=>{}}///onFinish
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
            onValuesChange={({ layout }) => setFormLayout(layout)}
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
};
