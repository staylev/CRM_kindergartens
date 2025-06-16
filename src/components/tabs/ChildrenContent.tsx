import { useEffect, useState } from "react";
import { DatePicker, Form, Input, Button, message, Modal, Select } from "antd";
import ChildTable from "../tables/ChildTable";

type LayoutType = Parameters<typeof Form>[0]["layout"];

export const ChildrenContent = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allGroups, setAllGroups] = useState<any[]>([]);
  const [kindergartens, setKindergartens] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedKindergarten, setSelectedKindergarten] = useState<string | null>(null);

  useEffect(() => {
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      const parsedGroups = JSON.parse(storedGroups);
      setAllGroups(parsedGroups.data || []);
    }

    const storedKindergartens = localStorage.getItem('kindergartens');
    if (storedKindergartens) {
      setKindergartens(JSON.parse(storedKindergartens));
    }
  }, []);

  const handleKindergartenChange = (kindergartenTitle: string) => {
    // Находим детский сад по названию
    const selectedKindergartenObj = kindergartens.find(k => k.attributes.title === kindergartenTitle);
    
    if (selectedKindergartenObj) {
      setSelectedKindergarten(selectedKindergartenObj.id);
      form.setFieldsValue({ attributes: { group_id: undefined } }); // Сбрасываем выбор группы
      
      // Фильтруем группы по названию детского сада
      const filtered = allGroups.filter(group => 
        group.attributes.kindergarten_title === kindergartenTitle
      );
      
      setFilteredGroups(filtered);
    }
  };

  const onFinish = (values: any) => {
    try {
      const storedChildren = localStorage.getItem('children');
      const childrenData: any = storedChildren ? JSON.parse(storedChildren) : {
        included: [],
        meta: { count: 0, totalPages: 1 },
        data: []
      };

      const selectedGroup = filteredGroups.find(g => g.id === values.attributes.group_id);
      const selectedKindergartenObj = kindergartens.find(k => k.attributes.title === values.attributes.kindergarten_title);
      
      const newChild = {
        type: "child",
        id: Date.now().toString(),
        attributes: {
          first_name: values.attributes.first_name,
          last_name: values.attributes.last_name,
          patronymic: values.attributes.patronymic,
          date_of_birth: values.attributes.date_of_birth.format('YYYY-MM-DD'),
          group_title: selectedGroup?.attributes?.title || '',
          gender: '',
          image: '',
          kindergarten_title: selectedKindergartenObj?.attributes?.title || '',
          kindergartens_id: selectedKindergartenObj?.id || '',
        },
        relationships: {
          group: {
            data: {
              id: values.attributes.group_id,
              type: "group"
            }
          }
        }
      };

      const updatedData = {
        ...childrenData,
        data: [...childrenData.data, newChild],
        meta: {
          ...childrenData.meta,
          count: childrenData.meta.count + 1
        }
      };

      localStorage.setItem('children', JSON.stringify(updatedData));
      message.success('Ребёнок успешно добавлен');
      form.resetFields();
      setRefreshTable(prev => !prev);
      setIsModalOpen(false);
      setSelectedKindergarten(null);
      setFilteredGroups([]);
    } catch (error) {
      message.error('Ошибка при добавлении ребёнка');
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedKindergarten(null);
    setFilteredGroups([]);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Дети</h1>
      <div className="pt-5">
        <Button className="mb-5 float-end" onClick={showModal}>
          Добавить
        </Button>
        <ChildTable refreshTable={refreshTable} />
      </div>

      <Modal
        title="Добавить ребёнка"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} onFinish={onFinish} layout={formLayout}>
          <Form.Item
            label="Имя"
            name={["attributes", "first_name"]}
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Фамилия"
            name={["attributes", "last_name"]}
            rules={[{ required: true, message: "Введите фамилию" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name={["attributes", "patronymic"]}
            rules={[{ required: true, message: "Введите отчество" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Дата рождения"
            name={["attributes", "date_of_birth"]}
            rules={[{ required: true, message: "Выберите дату" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Детский сад"
            name={["attributes", "kindergarten_title"]}
            rules={[{ required: true, message: "Пожалуйста, выберите Детский сад" }]}
          >
            <Select 
              onChange={handleKindergartenChange}
              placeholder="Выберите детский сад"
            >
              {kindergartens.map((kindergarten) => (
                <Select.Option key={kindergarten.id} value={kindergarten.attributes.title}>
                  {kindergarten.attributes.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Группа"
            name={["attributes", "group_id"]}
            rules={[{ required: true, message: "Выберите группу" }]}
          >
            <Select 
              disabled={!selectedKindergarten}
              placeholder={selectedKindergarten ? "Выберите группу" : "Сначала выберите детский сад"}
            >
              {filteredGroups.map(group => (
                <Select.Option key={group.id} value={group.id}>
                  {group.attributes.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}