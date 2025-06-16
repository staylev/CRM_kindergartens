import { useState, useEffect } from "react";
import "../../styles/parent-detail-page.css";
import { useNavigate, useParams } from "react-router-dom";
import { Parents, ParentsAttributes } from "../../types/Parent..type";
import { message } from "antd";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  group: string;
  photo?: string;
}
 

export default function ParentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [parent, setParent] = useState<Parents | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  

  // Загрузка данных
  useEffect(() => {
    const loadData = () => {
      try {
        const parentsData = localStorage.getItem("parents") || "[]";
        console.log(id)
        console.log(parentsData)
        const childrenData = localStorage.getItem("children");

        if (!parentsData || !childrenData) {
          alert("Нет данных в localStorage");
          navigate("/parents");
          return;
        }

        const allParents = JSON.parse(parentsData);
        const allChildren = JSON.parse(childrenData).data || [];

        const foundParent = allParents.find((p: ParentsAttributes ) => p.tg === id); // или p.id === id

   
        console.log("foundParent", foundParent);
        console.log("allParents", allParents);

        if (!foundParent) {
          alert("Родитель не найден");
          navigate("/parents");
          return;
        }

        // Найдём детей этого родителя
        const parentChildren = allChildren.filter((child: any) =>
          foundParent.childrenIds.includes(child.id)
        );

        const normalizedChildren = parentChildren.map((c: any) => ({
          id: c.attributes.tg ,
          firstName: c.attributes.first_name,
          lastName: c.attributes.last_name,
          dateOfBirth: c.attributes.date_of_birth,
          group: c.attributes.group_title,
          photo: c.attributes.image
        }));

        setParent(foundParent);
        setChildrenList(normalizedChildren);
      } catch (error) {
        console.error("Ошибка загрузки данных", error);
        navigate("/parents");
      }
    };

    loadData();
  }, [id, navigate]);

  // Сохранение изменений
  const handleSave = () => {
    if (!parent) return;

    try {
      const storedParents = localStorage.getItem("parents");
      const parsedParents = storedParents ? JSON.parse(storedParents) : [];

      const updatedParents = parsedParents.map((p: Parents) =>
        p.attributes.tg  === parent.attributes.tg ? parent : p
      );

      localStorage.setItem("parents", JSON.stringify(updatedParents));
      message.success("Данные успешно сохранены");
      setEditMode(false);
    } catch (error) {
      message.error("Ошибка при сохранении данных");
    }
  };

  const handleChange = (field: keyof Parents['attributes'], value: string) => {
    setParent((prev) =>
      prev ? { 
        ...prev, 
        attributes: { 
          ...prev.attributes, 
          [field]: value 
        } 
      } : null
    );
  };
  if (!parent) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div className="parent-detail-container">
      <header className="parent-detail-header">
        <div className="header-content">
          <h1>Информация о родителе</h1>
          <div className="header-actions">
            <button className="edit-button" onClick={() => navigate("/parents")}>
              назад к списку
            </button>
            <button className="edit-button" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Сохранить" : "Редактировать"}
            </button>
            <button className="print-button">Печать</button>
          </div>
        </div>
      </header>

      <div className="parent-detail-content">
        <div className="parent-sidebar">
          <div className="parent-photo-container">
            <img
              src={"/placeholder.svg"}
              alt={`${parent.attributes.frist_name} ${parent.attributes.last_name}`}
              className="parent-photo"
            />
            {editMode && <button className="change-photo-button">Изменить фото</button>}
          </div>

          <div className="parent-quick-info">
            <h2>
              {parent.attributes.last_name} {parent.attributes.frist_name} {parent.attributes.patronymic}
            </h2>
            <p className="parent-relation">{parent.attributes.type_of_parent}</p>
          </div>

          <nav className="parent-tabs">
            <button
              className={`tab-button ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Личная информация
            </button>
            <button
              className={`tab-button ${activeTab === "children" ? "active" : ""}`}
              onClick={() => setActiveTab("children")}
            >
              Дети
            </button>
          </nav>
        </div>

        <div className="parent-main-content">
          {activeTab === "info" && (
            <div className="tab-content">
              <h3>Личная информация</h3>
              <div className="info-grid">
                <div className="info-group">
                  <label>Фамилия:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent.attributes.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.last_name}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Имя:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent. attributes.frist_name}
                      onChange={(e) => handleChange("frist_name", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.frist_name}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Отчество:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent.attributes.patronymic}
                      onChange={(e) => handleChange("patronymic", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.patronymic}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Кем приходится:</label>
                  {editMode ? (
                    <select
                      value={parent.attributes.type_of_parent}
                      onChange={(e) => handleChange("type_of_parent", e.target.value)}
                    >
                      <option value="Мать">Мать</option>
                      <option value="Отец">Отец</option>
                      <option value="Бабушка">Бабушка</option>
                      <option value="Дедушка">Дедушка</option>
                      <option value="Опекун">Опекун</option>
                      <option value="Другое">Другое</option>
                    </select>
                  ) : (
                    <span>{parent.attributes.type_of_parent}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Дата рождения:</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={new Date(parent.attributes.date_of_birth).toISOString().split("T")[0]}
                      onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    />
                  ) : (
                    <span>{new Date(parent.attributes.date_of_birth).toLocaleDateString("ru-RU")}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Паспорт:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent.attributes.pasport_series}
                      onChange={(e) => handleChange("pasport_series", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.pasport_series}</span>
                  )}
                </div>
              </div>

              <h4>Контактная информация</h4>
              <div className="info-grid">
                <div className="info-group">
                  <label>Адрес:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent.attributes.adress}
                      onChange={(e) => handleChange("adress", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.adress}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Телефон:</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={parent.attributes.number_phone}
                      onChange={(e) => handleChange("number_phone", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.number_phone}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Email:</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={parent.attributes.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.email}</span>
                  )}
                </div>
              </div>

              <h4>Информация о работе</h4>
              <div className="info-grid">
                <div className="info-group">
                  <label>Место работы:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent.attributes.place_of_work}
                      onChange={(e) => handleChange("place_of_work", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.place_of_work}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Должность:</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={parent.attributes.post}
                      onChange={(e) => handleChange("post", e.target.value)}
                    />
                  ) : (
                    <span>{parent.attributes.post}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "children" && (
            <div className="tab-content">
              <div className="children-header">
                <h3>Дети</h3>
                {editMode && <button className="add-button">+ Добавить ребенка</button>}
              </div>

              <div className="children-table-container">
                <table className="children-table">
                  <thead>
                    <tr>
                      <th>Фото</th>
                      <th>Имя</th>
                      <th>Фамилия</th>
                      <th>Возраст</th>
                      <th>Группа</th>
                      {editMode && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {childrenList.length > 0 ? (
                      childrenList.map((child) => (
                        <tr key={child.id}>
                          <td>
                            <div className="child-photo-cell">
                              <img
                                src={child.photo || "/placeholder.svg"}
                                alt={`${child.firstName} ${child.lastName}`}
                              />
                            </div>
                          </td>
                          <td>{child.firstName}</td>
                          <td>{child.lastName}</td>
                          {/* <td>{child.age} лет</td> */}
                          <td>{child.group}</td>
                          <td>
                            <div className="table-actions">
                              <button className="view-button">Просмотр</button>
                              {editMode && (
                                <>
                                  <button className="edit-item-button">Редактировать</button>
                                  <button className="delete-item-button">Удалить</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>Нет детей</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}