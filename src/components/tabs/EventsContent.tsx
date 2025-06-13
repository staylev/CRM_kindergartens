import { Button, DatePicker, Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import EventTable from "../tables/EventTable";
import { EventData, events } from "../../types/event.type";

dayjs.extend(utc);
dayjs.extend(timezone);

type LayoutType = Parameters<typeof Form>[0]["layout"];

export const EventsContent = () => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [refreshTable, setRefreshTable] = useState(false);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kindergartens, setkinddergartens] = useState<any[]>([]);
 

  const saveEventToLocalStorage = (event: EventData) => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  };

  const onFinish = async (values: EventData) => {
    try {
      const selectedKindergarten = kindergartens.find(k => k.id === values.attributes.kindergarten_title);
      
      const newEvent: EventData = {
        id: Date.now().toString(),
        type: "event",
        attributes: {
          ...values.attributes,
          datetime_start: new Date(values.attributes.datetime_start),
          datetime_end: new Date(values.attributes.datetime_end),
          type_event: 'standard',
          date: new Date(),
          kindergarten_title: selectedKindergarten?.attributes?.title || '',
          kinddergarten_id: selectedKindergarten?.id || '',
        }
      };
      
      saveEventToLocalStorage(newEvent);
      message.success('Мероприятие успешно добавлено');
      form.resetFields();
      setRefreshTable(prev => !prev);
    } catch (error) {
      message.error('Ошибка при добавлении мероприятия');
    }
  };

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const showModal = () => {
    setIsModalOpen(true);
   
    const storedkinddergartens= JSON.parse(localStorage.getItem('kindergartens') || '[]');
    setkinddergartens(storedkinddergartens);
  
  };
  
  const handleOk = () => {
    const values = form.getFieldsValue();
    if (!values.attributes?.title || 
        !values.attributes?.description || 
        !values.attributes?.datetime_start || 
        !values.attributes?.datetime_end ) {
      message.error('Пожалуйста, заполните все обязательные поля');
      return;
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
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_start: dateWithTimeZone,
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_start: null,
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
                if (date) {
                  const dateWithTimeZone = dayjs(date).tz(userTimeZone).format();
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue("attributes"),
                      datetime_end: dateWithTimeZone,
                    },
                  });
                } else {
                  form.setFieldsValue({
                    attributes: {
                      ...form.getFieldValue('attributes'),
                      datetime_end: null,
                    },
                  });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Детский сад"
            name={["attributes", "kindergarten_title"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите детский сад",
              },
            ]}
          >
            <Select style={{ width: 200 }} optionFilterProp="label">
              {kindergartens.map((item) => (
                <Select.Option key={item.id}>
                  {item.attributes.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};