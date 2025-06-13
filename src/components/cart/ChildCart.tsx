import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import "../../styles/ChildCart.css";


 

interface ChildData {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  dateOfBirth: string;
  gender: string;
  group: string;
  notes: Array<{
    date: string;
    author: string;
    text: string;
  }>;
}


export default function ChildCart() {
  const [child, setChild] = useState<ChildData | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [editMode, setEditMode] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Load child data from localStorage
  useEffect(() => {
    try {
      const storedChildren = localStorage.getItem('children');
      if (storedChildren) {
        const childrenData = JSON.parse(storedChildren);
        const foundChild = childrenData.data.find((c: any) => c.id === id);
        
        if (foundChild) {
          const formattedChild: ChildData = {
            id: foundChild.id,
            firstName: foundChild.attributes.first_name,
            lastName: foundChild.attributes.last_name,
            dateOfBirth: foundChild.attributes.date_of_birth,
            gender: foundChild.attributes.gender || "Не указан",
            group: foundChild.attributes.group_title || "Не указана",
            notes: foundChild.attributes.notes || [] // Загружаем заметки из attributes
          };
          setChild(formattedChild);
        } else {
          message.error("Ребёнок не найден");
          navigate("/childrens");
        }
      } else {
        message.error("Данные о детях не найдены");
        navigate("/childrens");
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      message.error("Ошибка загрузки данных");
      navigate("/childrens");
    }
  }, [id, navigate]);

  const handleAddNote = () => {
    if (newNote.trim() && child) {
      const updatedChild = {
        ...child,
        notes: [
          {
            date: new Date().toISOString().split("T")[0],
            author: "Текущий пользователь",
            text: newNote,
          },
          ...child.notes,
        ],
      };
      setChild(updatedChild);
      setNewNote("");
      
      // Update in localStorage
      const storedChildren = localStorage.getItem('children');
      if (storedChildren) {
        const childrenData = JSON.parse(storedChildren);
        const updatedData = {
          ...childrenData,
          data: childrenData.data.map((c: any) => 
            c.id === child.id ? {
              ...c,
              attributes: {
                ...c.attributes,
                notes: updatedChild.notes
              }
            } : c
          )
        };
        localStorage.setItem('children', JSON.stringify(updatedData));
      }
    }
  };

  const handleSave = () => {
    if (!child) return;
    
    try {
      const storedChildren = localStorage.getItem('children');
      if (storedChildren) {
        const childrenData = JSON.parse(storedChildren);
        const updatedData = {
          ...childrenData,
          data: childrenData.data.map((c: any) => 
            c.id === child.id ? {
              ...c,
              attributes: {
                ...c.attributes,
                first_name: child.firstName,
                last_name: child.lastName,
                date_of_birth: child.dateOfBirth,
                gender: child.gender,
                group_title: child.group
              }
            } : c
          )
        };
        localStorage.setItem('children', JSON.stringify(updatedData));
        message.success("Изменения сохранены");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      message.error("Ошибка сохранения данных");
    }
  };

  function getAgeWithCorrectWord(age: number): string {
    if (age % 100 >= 11 && age % 100 <= 14) {
      return `${age} лет`;
    }
    
    switch (age % 10) {
      case 1:
        return `${age} год`;
      case 2:
      case 3:
      case 4:
        return `${age} года`;
      default:
        return `${age} лет`;
    }
  }

  if (!child) {
    return <div className="loading">Загрузка...</div>;
  }

  const calculateAge = () => {
    return Math.floor(
      (new Date().getTime() - new Date(child.dateOfBirth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
    );
  };

  return (
    <div className="child-detail-container">
      <header className="child-detail-header">
        <div className="header-content">
          <h1>Информация о ребёнке</h1>
          <div className="header-actions">
            <button className="edit-button" onClick={() => navigate("/childrens")}>
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

      <div className="child-detail-content">
        <div className="child-sidebar">
          <div className="child-photo-container">
            <img
              src={child.photo || "/placeholder.svg"}
              alt={`${child.firstName} ${child.lastName}`}
              className="child-photo"
            />
            {editMode && (
              <button className="change-photo-button">Изменить фото</button>
            )}
          </div>

          <div className="child-quick-info">
            <h2>
              {child.firstName} {child.lastName}
            </h2>
            <p className="child-group">{child.group}</p>
          </div>

          <nav className="child-tabs">
            <button
              className={`tab-button ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              Общая информация
            </button>
            <button
              className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              Заметки
            </button>
          </nav>
        </div>

        <div className="child-main-content">
          {activeTab === "general" && (
            <div className="tab-content">
              <h3>Общая информация</h3>
              <div className="info-grid">
                <div className="info-group">
                  <label>Имя:</label>
                  {editMode ? (
                    <input 
                      value={child.firstName}
                      onChange={(e) => setChild({...child, firstName: e.target.value})}
                    />
                  ) : (
                    <span>{child.firstName}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Фамилия:</label>
                  {editMode ? (
                    <input 
                      value={child.lastName}
                      onChange={(e) => setChild({...child, lastName: e.target.value})}
                    />
                  ) : (
                    <span>{child.lastName}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Дата рождения:</label>
                  {editMode ? (
                    <input 
                      type="date"
                      value={child.dateOfBirth}
                      onChange={(e) => setChild({...child, dateOfBirth: e.target.value})}
                    />
                  ) : (
                    <span>
                      {new Date(child.dateOfBirth).toLocaleDateString("ru-RU")}
                    </span>
                  )}
                </div>
                <div className="info-group">
                  <label>Возраст:</label>
                  <span>
                    {getAgeWithCorrectWord(calculateAge())}
                  </span>
                </div>
                <div className="info-group">
                  <label>Пол:</label>
                  {editMode ? (
                    <select 
                      value={child.gender}
                      onChange={(e) => setChild({...child, gender: e.target.value})}
                    >
                      <option value="Мужской">Мужской</option>
                      <option value="Женский">Женский</option>
                    </select>
                  ) : (
                    <span>{child.gender}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Группа:</label>
                  {editMode ? (
                    <select 
                      value={child.group}
                      onChange={(e) => setChild({...child, group: e.target.value})}
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
                    <span>{child.group}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="tab-content">
              <h3>Заметки и наблюдения</h3>

              {editMode && (
                <div className="add-note-form">
                  <textarea
                    placeholder="Добавить новую заметку..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button className="add-note-button" onClick={handleAddNote}>
                    Добавить заметку
                  </button>
                </div>
              )}

              <div className="notes-list">
                {child.notes.map((note, index) => (
                  <div key={index} className="note-card">
                    <div className="note-header">
                      <span className="note-date">
                        {new Date(note.date).toLocaleDateString("ru-RU")}
                      </span>
                      <span className="note-author">{note.author}</span>
                      {editMode && (
                        <div className="note-actions">
                          <button className="delete-note-button">
                            Удалить
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="note-content">{note.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}