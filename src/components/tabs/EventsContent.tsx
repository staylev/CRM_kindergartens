import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import { useEvent } from "../../hooks/useEvent";
 
import { useGroups } from "../../hooks/useGroup";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
import { useChild } from "../../hooks/useChild"; 
import EventTable from "../tables/EventTable";
import { EventData } from "../../types/event.type";


type LayoutType = Parameters<typeof Form>[0]["layout"];
/**
 * Компонент для отображения информации о группах
 */
export const EventsContent = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [refreshTable, setRefreshTable] = useState(false);
  const { addEventMutation, EventListMutation } = useEvent();

  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const onFinish = async (values: EventData) => {
    try {
      await addEventMutation.mutateAsync(values);
      message.success('Мероприятие успешно добавлено');
      form.resetFields();
      setRefreshTable((prev) => !prev);
      EventListMutation.mutate();
    } catch (error) {
      message.error('Ошибка при добавлении ребёнка');
    }
  };
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { GroupListMutation } = useGroups()
  const {ChildListMutation } = useChild()

  const showModal = () => {
    setIsModalOpen(true);
    GroupListMutation.mutate();
    ChildListMutation.mutate();
  };
  
  const handleOk = () => {
    const values = form.getFieldsValue();
    if (!values.attributes?.title || !values.attributes?.description || !values.attributes?.datetime_start || !values.attributes?.datetime_end || !values.attributes.child_id || !values.attributes?.group_id) {
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
      <h1 className="mt-4">Мероприятие</h1>
      <div className="pt-5">
        <Button
          className="mb-5 float-end"
          color="default"
          variant="solid"
          onClick={showModal}
        >
          Добавить
        </Button>
        <EventTable refreshTable={refreshTable} />
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
                message: "Пожалуйста, введите название мероприятия",
              },
            ]}
          >
            <Input placeholder="Название" />
          </Form.Item>
          <Form.Item
            label="Описание"
            name={["attributes", "description"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите описание мероприятия",
              },
            ]}
          >
            <Input placeholder="Описание" />
          </Form.Item>
          
          <Form.Item
            label="Дата начала"
            name={["attributes", "datetime_start"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите дату начала мероприятия",
              },
            ]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : "",
            })}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime
              onChange={(date) => {
                // Check if date is valid
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_start: dateWithTimeZone, // Set the formatted date string
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_start: null, // Очищаем значение, если дата не выбрана
                    },
                  });
                }
              }}
            />
          </Form.Item>
         
          <Form.Item
            label="Дата окончания"
            name={["attributes", "datetime_end"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите дату окончания мероприятия",
              },
            ]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : "",
            })}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime
              onChange={(date) => {
                // Check if date is valid
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_end: dateWithTimeZone, // Set the formatted date string
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_end: null, // Очищаем значение, если дата не выбрана
                    },
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Фамилия ребёнка"
            name={["attributes", "child_id"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите фамилию ребёнка",
              },
            ]}
          >
           <Select style={{ width: 200 }} optionFilterProp="label">
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

  );};
 

