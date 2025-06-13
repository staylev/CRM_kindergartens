
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, message } from "antd";
import "../../styles/group-detail-page.css";
import { Groups } from "../../types/Groups..type";
import Table, { ColumnsType } from "antd/es/table";
export default function GroupDetailPage() {
  const [group, setGroup] = useState<Groups | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);


  // Добавляем интерфейс для ребенка
interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}
useEffect(() => {
  if (group) {
    setChildren(getChildrenInGroup(group.id));
  }
}, [group]);
 
// Получаем список детей из localStorage
const getChildrenInGroup = (groupId: string): Child[] => {
  const childrenData = localStorage.getItem('children');
  if (!childrenData) return [];
  
  try {
    const childrenList = JSON.parse(childrenData);
    return childrenList.data
      .filter((child: any) => child.relationships?.group?.data?.id === groupId)
      .map((child: any) => ({
        id: child.id,
        firstName: child.attributes.first_name,
        lastName: child.attributes.last_name,
        age: calculateAge(child.attributes.date_of_birth),
      }));
  } catch (e) {
    console.error("Ошибка при загрузке детей", e);
    return [];
  }
};

// Функция для расчета возраста
const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Колонки для таблицы
const columns: ColumnsType<Child> = [
  {
    title: 'ФИО',
    dataIndex: 'lastName',
    key: 'name',
    render: (_, record) => `${record.lastName} ${record.firstName}`,
    sorter: (a, b) => a.lastName.localeCompare(b.lastName),
  },
  {
    title: 'Возраст',
    dataIndex: 'age',
    key: 'age',
    render: (age) => `${age} ${getAgeWord(age)}`,
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (_, record) => (
      <a onClick={() => navigate(`/childrens/${record.id}`)}>Подробнее</a>
    ),
  },
];

// Функция для правильного склонения слова "год"
const getAgeWord = (age: number): string => {
  if (age % 100 >= 11 && age % 100 <= 14) {
    return 'лет';
  }
  
  switch (age % 10) {
    case 1: return 'год';
    case 2:
    case 3:
    case 4: return 'года';
    default: return 'лет';
  }
};

  useEffect(() => {
    const loadGroupData = () => {
      try {
        setIsLoading(true);
        const storedGroups = localStorage.getItem("groups");
        
        if (storedGroups) {
          const groupsData = JSON.parse(storedGroups);
          const foundGroup = groupsData.data.find((g: Groups) => g.id === id);
          
          if (foundGroup) {
            setGroup(foundGroup);
          } else {
            message.error("Группа не найдена");
            navigate("/groups");
          }
        } else {
          message.error("Данные о группах не найдены");
          navigate("/groups");
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        message.error("Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupData();
  }, [id, navigate]);

  const handleSave = () => {
    if (!group) return;
    
    try {
      const storedGroups = localStorage.getItem("groups");
      if (storedGroups) {
        const groupsData = JSON.parse(storedGroups);
        const updatedData = {
          ...groupsData,
          data: groupsData.data.map((g: Groups) => 
            g.id === group.id ? group : g
          )
        };
        
        localStorage.setItem("groups", JSON.stringify(updatedData));
        message.success("Изменения сохранены");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      message.error("Ошибка сохранения данных");
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!group) {
    return <div className="error">Группа не найдена</div>;
  }
  return (
    <div className="group-detail-container">
      <header className="group-detail-header">
        <div className="header-content">
          <h1>Информация о группе</h1>
          <div className="header-actions">
            <button className="edit-button" onClick={() => navigate("/groups")}>
              Назад к списку
            </button>
            <button
              className="edit-button"
              onClick={editMode ? handleSave : () => setEditMode(true)}
            >
              {editMode ? "Сохранить" : "Редактировать"}
            </button>
          </div>
        </div>
      </header>

      <div className="group-detail-content">
        <div className="group-sidebar">
          <div className="group-info-container">
            <h2>{group.attributes.title}</h2>
            <p className="group-type">{group.attributes.type_group}</p>
          </div>

          <nav className="group-tabs">
            <button
              className={`tab-button ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Общая информация
            </button>
            <button
              className={`tab-button ${
                activeTab === "children" ? "active" : ""
              }`}
              onClick={() => setActiveTab("children")}
            >
              Список детей
            </button>
          </nav>
        </div>

        <div className="group-main-content">
          {activeTab === "info" && (
            <div className="tab-content">
              <h3>Общая информация</h3>
              <div className="info-grid">
                <div className="info-group">
                  <label>Название группы:</label>
                  {editMode ? (
                    <input
                      value={group.attributes.title}
                      onChange={(e) =>
                        setGroup({
                          ...group,
                          attributes: {
                            ...group.attributes,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  ) : (
                    <span>{group.attributes.title}</span>
                  )}
                </div>

                <div className="info-group">
                  <label>Тип группы:</label>
                  {editMode ? (
                    <select
                      value={group.attributes.type_group}
                      onChange={(e) =>
                        setGroup({
                          ...group,
                          attributes: {
                            ...group.attributes,
                            type_group: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="Ясельная группа">Ясельная группа</option>
                      <option value="Младшая группа">Младшая группа</option>
                      <option value="Средняя группа">Средняя группа</option>
                      <option value="Старшая группа">Старшая группа</option>
                      <option value="Подготовительная группа">
                        Подготовительная группа
                      </option>
                    </select>
                  ) : (
                    <span>{group.attributes.type_group}</span>
                  )}
                </div>

                <div className="info-group">
                  <label>Номер кабинета:</label>
                  {editMode ? (
                    <input
                      value={group.attributes.number_classroom}
                      onChange={(e) =>
                        setGroup({
                          ...group,
                          attributes: {
                            ...group.attributes,
                            number_classroom: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  ) : (
                    <span>{group.attributes.number_classroom}</span>
                  )}
                </div>

                <div className="info-group">
                  <label>Количество детей:</label>
                  <span>{children.length}</span>
                </div>

                <div className="info-group">
                  <label>Детский сад:</label>
                  <span>{group.attributes.kindergarten_title}</span>
                </div>

                <div className="info-group full-width">
                  <label>Описание:</label>
                  {editMode ? (
                    <textarea
                      value={group.attributes.description}
                      onChange={(e) =>
                        setGroup({
                          ...group,
                          attributes: {
                            ...group.attributes,
                            description: e.target.value,
                          },
                        })
                      }
                      rows={3}
                    />
                  ) : (
                    <span>{group.attributes.description}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "children" && (
            <div className="tab-content">
              <div className="children-header">
                <h3>Список детей ({children.length})</h3>
                <div className="children-actions">
                  <Input
                    placeholder="Поиск по имени или фамилии"
                    allowClear
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                  />
                </div>
              </div>

              <Table<Child>
                columns={columns}
                dataSource={children.filter(
                  (child) =>
                    child.firstName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    child.lastName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )}
                rowKey="id"
                bordered
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: "Нет детей в этой группе",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}