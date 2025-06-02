"use client";

import { useEffect, useState } from "react";
import "../../styles/ChildCart.css";
import { useNavigate, useParams } from "react-router-dom";
import { demoChildData } from "../../DemoData/demoData";
import { useChild } from "../../hooks/useChild";
import { ChildDataDetails, children } from "../../types/children.types";
import { message } from "antd";
 

export default function ChildCart() {
  const [ChildData, setChildData] = useState(demoChildData);
  const [child, setChild] = useState(ChildData);
  const [activeTab, setActiveTab] = useState("general");
  const [editMode, setEditMode] = useState(false);
  const [newNote, setNewNote] = useState("");

  const { id } = useParams<{ id: string }>(); // Получаем ID группы из URL

  const {ChildListMutation} = useChild()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        // Получаем список всех детских садов
        const data = await ChildListMutation.mutateAsync();
        
        // Находим детский сад по ID из URL
        const foundChild = data.data.find((kg: children) => kg.id === id);
        
        if (foundChild) {  
          // Форматируем данные из API в нужный нам формат
          const formattedData:  ChildDataDetails = {
            ...demoChildData, // берем все демо-поля
            id: foundChild.id, 
            firstName: foundChild.attributes.first_name,
            lastName: foundChild.attributes.last_name,
            dateOfBirth: foundChild.attributes.date_of_birth,
          }
          setChildData(formattedData);
        } else {
          message.warning("Детский сад не найден, используются демо-данные");
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
     
        message.error("Ошибка при загрузке данных, используются демо-данные");
      } finally {
      
      }
    };

    fetchChildData();
  }, [id]);

  useEffect(() => {
    setChild(ChildData);
  }, [ChildData]);

  const handleAddNote = () => {
    if (newNote.trim()) {
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
    }
  };
  // Функция для определения правильной формы слова "год"
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

  return (
    <div className="child-detail-container">
      <header className="child-detail-header">
        <div className="header-content">
          <h1>Информация о ребёнке</h1>

          <div className="header-actions">
            <button
              className="edit-button"
              onClick={() => navigate("/childrens")}
            >
              Назад к списку
            </button>
            <button
              className="edit-button"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Сохранить" : "Редактировать"}
            </button>
            <button className="print-button">Печать</button>
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
            <p className="child-id">ID: {child.id}</p>
            <p className="child-group">{child.group}</p>
          </div>

          <nav className="child-tabs">
            <button
              className={`tab-button ${
                activeTab === "general" ? "active" : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              Общая информация
            </button>
            <button
              className={`tab-button ${
                activeTab === "contacts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              Контакты
            </button>
            <button
              className={`tab-button ${
                activeTab === "medical" ? "active" : ""
              }`}
              onClick={() => setActiveTab("medical")}
            >
              Медицинская информация
            </button>
            <button
              className={`tab-button ${
                activeTab === "attendance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("attendance")}
            >
              Посещаемость
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
                    <input type="text" defaultValue={child.firstName} />
                  ) : (
                    <span>{child.firstName}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Фамилия:</label>
                  {editMode ? (
                    <input type="text" defaultValue={child.lastName} />
                  ) : (
                    <span>{child.lastName}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Дата рождения:</label>
                  {editMode ? (
                    <input type="date" />
                  ) : (
                    <span>
                      {new Date(child.dateOfBirth).toLocaleDateString("ru-RU")}
                    </span>
                  )}
                </div>
                <div className="info-group">
                  <label>Возраст:</label>
                  <span>
                    {getAgeWithCorrectWord(
                      Math.floor(
                        (new Date().getTime() -
                          new Date(child.dateOfBirth).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )
                    )}
                  </span>
                </div>
                <div className="info-group">
                  <label>Пол:</label>
                  {editMode ? (
                    <select defaultValue={child.gender}>
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
                    <select defaultValue={child.group}>
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
                <div className="info-group">
                  <label>Дата зачисления:</label>
                  {editMode ? (
                    <input type="date" defaultValue={child.enrollmentDate} />
                  ) : (
                    <span>
                      {new Date(child.enrollmentDate).toLocaleDateString(
                        "ru-RU"
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="tab-content">
              <h3>Контактная информация</h3>

              <div className="section-header">
                <h4>Родители / Опекуны</h4>
                {editMode && <button className="add-button">+ Добавить</button>}
              </div>

              {child.parents.map((parent) => (
                <div key={parent.id} className="contact-card">
                  <div className="contact-header">
                    <h5>
                      {parent.relation}: {parent.firstName} {parent.lastName}
                    </h5>
                    {editMode && (
                      <div className="contact-actions">
                        <button className="edit-contact-button">
                          Редактировать
                        </button>
                        <button className="delete-contact-button">
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="contact-details">
                    <div className="contact-info">
                      <label>Телефон:</label>
                      <span>{parent.phone}</span>
                    </div>
                    <div className="contact-info">
                      <label>Email:</label>
                      <span>{parent.email}</span>
                    </div>
                    <div className="contact-info">
                      <label>Адрес:</label>
                      <span>{parent.address}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="section-header">
                <h4>Экстренные контакты</h4>
                {editMode && <button className="add-button">+ Добавить</button>}
              </div>

              {child.emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-header">
                    <h5>
                      {contact.name} ({contact.relation})
                    </h5>
                    {editMode && (
                      <div className="contact-actions">
                        <button className="edit-contact-button">
                          Редактировать
                        </button>
                        <button className="delete-contact-button">
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="contact-details">
                    <div className="contact-info">
                      <label>Телефон:</label>
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "medical" && (
            <div className="tab-content">
              <h3>Медицинская информация</h3>
              <div className="info-grid">
                <div className="info-group">
                  <label>Группа крови:</label>
                  {editMode ? (
                    <select defaultValue={child.medicalInfo.bloodType}>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <span>{child.medicalInfo.bloodType}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Врач:</label>
                  {editMode ? (
                    <input
                      type="text"
                      defaultValue={child.medicalInfo.doctorName}
                    />
                  ) : (
                    <span>{child.medicalInfo.doctorName}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Телефон врача:</label>
                  {editMode ? (
                    <input
                      type="text"
                      defaultValue={child.medicalInfo.doctorPhone}
                    />
                  ) : (
                    <span>{child.medicalInfo.doctorPhone}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Особые потребности:</label>
                  {editMode ? (
                    <input
                      type="text"
                      defaultValue={child.medicalInfo.specialNeeds}
                    />
                  ) : (
                    <span>{child.medicalInfo.specialNeeds}</span>
                  )}
                </div>
              </div>

              <div className="section-header">
                <h4>Аллергии</h4>
                {editMode && <button className="add-button">+ Добавить</button>}
              </div>

              <ul className="medical-list">
                {child.medicalInfo.allergies.length > 0 ? (
                  child.medicalInfo.allergies.map((allergy, index) => (
                    <li key={index} className="medical-item">
                      <span>{allergy}</span>
                      {editMode && (
                        <button className="delete-item-button">Удалить</button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="medical-item empty">Нет известных аллергий</li>
                )}
              </ul>

              <div className="section-header">
                <h4>Принимаемые лекарства</h4>
                {editMode && <button className="add-button">+ Добавить</button>}
              </div>

              <ul className="medical-list">
                {child.medicalInfo.medications.length > 0 ? (
                  child.medicalInfo.medications.map((medication, index) => (
                    <li key={index} className="medical-item">
                      <span>{medication}</span>
                      {editMode && (
                        <button className="delete-item-button">Удалить</button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="medical-item empty">
                    Нет принимаемых лекарств
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="tab-content">
              <h3>Посещаемость</h3>

              <div className="attendance-header">
                <div className="attendance-filters">
                  <select defaultValue="current-month">
                    <option value="current-month">Текущий месяц</option>
                    <option value="previous-month">Предыдущий месяц</option>
                    <option value="custom">Выбрать период</option>
                  </select>
                  {editMode && (
                    <button className="add-button">+ Добавить запись</button>
                  )}
                </div>
              </div>

              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Примечания</th>
                    {editMode && <th>Действия</th>}
                  </tr>
                </thead>
                <tbody>
                  {child.attendance.map((record, index) => (
                    <tr
                      key={index}
                      className={
                        record.status === "Отсутствовал" ? "absent" : ""
                      }
                    >
                      <td>
                        {new Date(record.date).toLocaleDateString("ru-RU")}
                      </td>
                      <td>
                        {editMode ? (
                          <select defaultValue={record.status}>
                            <option value="Присутствовал">Присутствовал</option>
                            <option value="Отсутствовал">Отсутствовал</option>
                            <option value="Опоздал">Опоздал</option>
                          </select>
                        ) : (
                          record.status
                        )}
                      </td>
                      <td>
                        {editMode ? (
                          <input type="text" defaultValue={record.notes} />
                        ) : (
                          record.notes
                        )}
                      </td>
                      {editMode && (
                        <td>
                          <button className="delete-item-button">
                            Удалить
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="attendance-summary">
                <div className="summary-item">
                  <span className="summary-label">Всего дней:</span>
                  <span className="summary-value">
                    {child.attendance.length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Присутствовал:</span>
                  <span className="summary-value">
                    {
                      child.attendance.filter(
                        (r) => r.status === "Присутствовал"
                      ).length
                    }
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Отсутствовал:</span>
                  <span className="summary-value">
                    {
                      child.attendance.filter(
                        (r) => r.status === "Отсутствовал"
                      ).length
                    }
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Посещаемость:</span>
                  <span className="summary-value">
                    {Math.round(
                      (child.attendance.filter(
                        (r) => r.status === "Присутствовал"
                      ).length /
                        child.attendance.length) *
                        100
                    )}
                    %
                  </span>
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
                          <button className="edit-note-button">
                            Редактировать
                          </button>
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
 