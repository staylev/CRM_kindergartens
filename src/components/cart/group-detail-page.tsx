"use client"

import { useState } from "react"
import "../../styles/group-detail-page.css"
import { useNavigate } from "react-router-dom"

// Пример данных о группе
const sampleGroup = {
  id: "G001",
  name: "Солнышко",
  type: "Старшая группа",
  ageRange: "5-6 лет",
  capacity: 25,
  currentEnrollment: 22,
  roomNumber: "203",
  description: "Группа для детей старшего дошкольного возраста с углубленным изучением творческих навыков.",
  schedule: {
    startTime: "08:00",
    endTime: "18:00",
    extendedHours: true,
  },
  staff: [
    {
      id: "T001",
      firstName: "Елена",
      lastName: "Петрова",
      position: "Воспитатель",
      photo: "/placeholder.svg?height=100&width=100",
      education: "Высшее педагогическое",
      experience: "12 лет",
      phone: "+7 (912) 345-67-89",
      email: "petrova@example.com",
    },
    {
      id: "T002",
      firstName: "Ольга",
      lastName: "Иванова",
      position: "Помощник воспитателя",
      photo: "/placeholder.svg?height=100&width=100",
      education: "Среднее специальное",
      experience: "5 лет",
      phone: "+7 (912) 987-65-43",
      email: "ivanova@example.com",
    },
    {
      id: "T003",
      firstName: "Марина",
      lastName: "Сидорова",
      position: "Логопед",
      photo: "/placeholder.svg?height=100&width=100",
      education: "Высшее специальное",
      experience: "8 лет",
      phone: "+7 (912) 111-22-33",
      email: "sidorova@example.com",
      schedule: "Вторник, Четверг 10:00-12:00",
    },
  ],
  children: [
    {
      id: "CH001",
      firstName: "Алексей",
      lastName: "Смирнов",
      age: 5,
      attendance: "Присутствует",
      specialNeeds: false,
      photo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "CH002",
      firstName: "Мария",
      lastName: "Козлова",
      age: 6,
      attendance: "Отсутствует",
      specialNeeds: false,
      photo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "CH003",
      firstName: "Дмитрий",
      lastName: "Новиков",
      age: 5,
      attendance: "Присутствует",
      specialNeeds: true,
      photo: "/placeholder.svg?height=50&width=50",
    },
    // Добавим еще детей для демонстрации
    {
      id: "CH004",
      firstName: "Анна",
      lastName: "Морозова",
      age: 5,
      attendance: "Присутствует",
      specialNeeds: false,
      photo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "CH005",
      firstName: "Игорь",
      lastName: "Соколов",
      age: 6,
      attendance: "Присутствует",
      specialNeeds: false,
      photo: "/placeholder.svg?height=50&width=50",
    },
  ],
  dailySchedule: [
    { time: "08:00 - 08:30", activity: "Прием детей" },
    { time: "08:30 - 09:00", activity: "Утренняя гимнастика" },
    { time: "09:00 - 09:30", activity: "Завтрак" },
    { time: "09:30 - 10:30", activity: "Образовательная деятельность" },
    { time: "10:30 - 12:00", activity: "Прогулка" },
    { time: "12:00 - 12:30", activity: "Обед" },
    { time: "12:30 - 15:00", activity: "Дневной сон" },
    { time: "15:00 - 15:30", activity: "Полдник" },
    { time: "15:30 - 16:30", activity: "Игры, самостоятельная деятельность" },
    { time: "16:30 - 18:00", activity: "Прогулка, уход домой" },
  ],
  weeklySchedule: [
    {
      day: "Понедельник",
      activities: [
        { time: "09:30 - 10:00", name: "Развитие речи" },
        { time: "10:10 - 10:40", name: "Физкультура" },
      ],
    },
    {
      day: "Вторник",
      activities: [
        { time: "09:30 - 10:00", name: "Математика" },
        { time: "10:10 - 10:40", name: "Музыка" },
      ],
    },
    {
      day: "Среда",
      activities: [
        { time: "09:30 - 10:00", name: "Окружающий мир" },
        { time: "10:10 - 10:40", name: "Физкультура" },
      ],
    },
    {
      day: "Четверг",
      activities: [
        { time: "09:30 - 10:00", name: "Рисование" },
        { time: "10:10 - 10:40", name: "Развитие речи" },
      ],
    },
    {
      day: "Пятница",
      activities: [
        { time: "09:30 - 10:00", name: "Лепка/Аппликация" },
        { time: "10:10 - 10:40", name: "Музыка" },
      ],
    },
  ],
  announcements: [
    {
      id: "A001",
      date: "2023-10-15",
      title: "Родительское собрание",
      content: "Уважаемые родители! Приглашаем вас на родительское собрание, которое состоится 20 октября в 18:00.",
      author: "Елена Петрова",
    },
    {
      id: "A002",
      date: "2023-10-10",
      title: "Осенний утренник",
      content:
        "25 октября состоится осенний утренник. Просим подготовить костюмы и выучить стихи согласно розданным материалам.",
      author: "Елена Петрова",
    },
  ],
}

export default function GroupDetailPage() {
  const [group, setGroup] = useState(sampleGroup)
  const [activeTab, setActiveTab] = useState("info")
  const [editMode, setEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" })

  // Фильтрация детей по поисковому запросу
  const filteredChildren = group.children.filter(
    (child) =>
      child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Добавление нового объявления
  const handleAddAnnouncement = () => {
    if (newAnnouncement.title.trim() && newAnnouncement.content.trim()) {
      const updatedGroup = {
        ...group,
        announcements: [
          {
            id: `A00${group.announcements.length + 1}`,
            date: new Date().toISOString().split("T")[0],
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            author: "Текущий пользователь",
          },
          ...group.announcements,
        ],
      }
      setGroup(updatedGroup)
      setNewAnnouncement({ title: "", content: "" })
    }
  }
 const navigate = useNavigate()
  return (
  
    <div className="group-detail-container">
      <header className="group-detail-header">
        <div className="header-content">
          <h1>Информация о группе</h1>
          <div className="header-actions">
            <button className="edit-button" onClick={() => navigate("/groups")}>
                назад к списку 
            </button>
            <button className="edit-button" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Сохранить" : "Редактировать"}
            </button>
            <button className="print-button">Печать</button>
          </div>
        </div>
      </header>

      <div className="group-detail-content">
        <div className="group-sidebar">
          <div className="group-info-container">
            <h2>{group.name}</h2>
            <p className="group-id">ID: {group.id}</p>
            <p className="group-type">{group.type}</p>
            <div className="group-capacity">
              <div className="capacity-bar">
                <div
                  className="capacity-fill"
                  style={{ width: `${(group.currentEnrollment / group.capacity) * 100}%` }}
                ></div>
              </div>
              <p>
                {group.currentEnrollment} / {group.capacity} детей
              </p>
            </div>
          </div>

          <nav className="group-tabs">
            <button
              className={`tab-button ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Общая информация
            </button>
            <button
              className={`tab-button ${activeTab === "staff" ? "active" : ""}`}
              onClick={() => setActiveTab("staff")}
            >
              Персонал
            </button>
            <button
              className={`tab-button ${activeTab === "children" ? "active" : ""}`}
              onClick={() => setActiveTab("children")}
            >
              Список детей
            </button>
            <button
              className={`tab-button ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              Расписание
            </button>
            <button
              className={`tab-button ${activeTab === "announcements" ? "active" : ""}`}
              onClick={() => setActiveTab("announcements")}
            >
              Объявления
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
                  {editMode ? <input type="text" defaultValue={group.name} /> : <span>{group.name}</span>}
                </div>
                <div className="info-group">
                  <label>Тип группы:</label>
                  {editMode ? (
                    <select defaultValue={group.type}>
                      <option value="Ясельная группа">Ясельная группа</option>
                      <option value="Младшая группа">Младшая группа</option>
                      <option value="Средняя группа">Средняя группа</option>
                      <option value="Старшая группа">Старшая группа</option>
                      <option value="Подготовительная группа">Подготовительная группа</option>
                    </select>
                  ) : (
                    <span>{group.type}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Возрастной диапазон:</label>
                  {editMode ? <input type="text" defaultValue={group.ageRange} /> : <span>{group.ageRange}</span>}
                </div>
                <div className="info-group">
                  <label>Номер кабинета:</label>
                  {editMode ? <input type="text" defaultValue={group.roomNumber} /> : <span>{group.roomNumber}</span>}
                </div>
                <div className="info-group">
                  <label>Вместимость:</label>
                  {editMode ? <input type="number" defaultValue={group.capacity} /> : <span>{group.capacity}</span>}
                </div>
                <div className="info-group">
                  <label>Текущее количество детей:</label>
                  {editMode ? (
                    <input type="number" defaultValue={group.currentEnrollment} />
                  ) : (
                    <span>{group.currentEnrollment}</span>
                  )}
                </div>
                <div className="info-group full-width">
                  <label>Описание:</label>
                  {editMode ? <textarea defaultValue={group.description} rows={3} /> : <span>{group.description}</span>}
                </div>
              </div>

              <h4>Режим работы</h4>
              <div className="info-grid">
                <div className="info-group">
                  <label>Время начала:</label>
                  {editMode ? (
                    <input type="time" defaultValue={group.schedule.startTime} />
                  ) : (
                    <span>{group.schedule.startTime}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Время окончания:</label>
                  {editMode ? (
                    <input type="time" defaultValue={group.schedule.endTime} />
                  ) : (
                    <span>{group.schedule.endTime}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Продленка:</label>
                  {editMode ? (
                    <div className="checkbox-wrapper">
                      <input type="checkbox" defaultChecked={group.schedule.extendedHours} id="extended-hours" />
                      <label htmlFor="extended-hours">Доступна</label>
                    </div>
                  ) : (
                    <span>{group.schedule.extendedHours ? "Да" : "Нет"}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "staff" && (
            <div className="tab-content">
              <div className="staff-header">
                <h3>Персонал группы</h3>
                {editMode && <button className="add-button">+ Добавить сотрудника</button>}
              </div>

              <div className="staff-grid">
                {group.staff.map((staffMember) => (
                  <div key={staffMember.id} className="staff-card">
                    <div className="staff-photo-container">
                      <img
                        src={staffMember.photo || "/placeholder.svg"}
                        alt={`${staffMember.firstName} ${staffMember.lastName}`}
                      />
                    </div>
                    <div className="staff-info">
                      <h4>
                        {staffMember.firstName} {staffMember.lastName}
                      </h4>
                      <p className="staff-position">{staffMember.position}</p>
                      <div className="staff-details">
                        <div className="staff-detail">
                          <label>Образование:</label>
                          <span>{staffMember.education}</span>
                        </div>
                        <div className="staff-detail">
                          <label>Опыт работы:</label>
                          <span>{staffMember.experience}</span>
                        </div>
                        <div className="staff-detail">
                          <label>Телефон:</label>
                          <span>{staffMember.phone}</span>
                        </div>
                        <div className="staff-detail">
                          <label>Email:</label>
                          <span>{staffMember.email}</span>
                        </div>
                        {staffMember.schedule && (
                          <div className="staff-detail">
                            <label>График работы:</label>
                            <span>{staffMember.schedule}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {editMode && (
                      <div className="staff-actions">
                        <button className="edit-item-button">Редактировать</button>
                        <button className="delete-item-button">Удалить</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "children" && (
            <div className="tab-content">
              <div className="children-header">
                <h3>Список детей</h3>
                <div className="children-actions">
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Поиск по имени..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {editMode && <button className="add-button">+ Добавить ребенка</button>}
                </div>
              </div>

              <div className="attendance-summary">
                <div className="summary-item">
                  <span className="summary-label">Всего детей:</span>
                  <span className="summary-value">{group.children.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Присутствует:</span>
                  <span className="summary-value">
                    {group.children.filter((child) => child.attendance === "Присутствует").length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Отсутствует:</span>
                  <span className="summary-value">
                    {group.children.filter((child) => child.attendance === "Отсутствует").length}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Особые потребности:</span>
                  <span className="summary-value">{group.children.filter((child) => child.specialNeeds).length}</span>
                </div>
              </div>

              <div className="children-table-container">
                <table className="children-table">
                  <thead>
                    <tr>
                      <th>Фото</th>
                      <th>Имя</th>
                      <th>Фамилия</th>
                      <th>Возраст</th>
                      <th>Статус</th>
                      <th>Особые потребности</th>
                      {editMode && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChildren.map((child) => (
                      <tr key={child.id} className={child.attendance === "Отсутствует" ? "absent-row" : ""}>
                        <td>
                          <div className="child-photo-cell">
                            <img src={child.photo || "/placeholder.svg"} alt={`${child.firstName} ${child.lastName}`} />
                          </div>
                        </td>
                        <td>{child.firstName}</td>
                        <td>{child.lastName}</td>
                        <td>{child.age} лет</td>
                        <td>
                          <span
                            className={`attendance-status ${child.attendance === "Присутствует" ? "present" : "absent"}`}
                          >
                            {child.attendance}
                          </span>
                        </td>
                        <td>
                          {child.specialNeeds ? (
                            <span className="special-needs-tag">Да</span>
                          ) : (
                            <span className="no-special-needs">Нет</span>
                          )}
                        </td>
                        {editMode && (
                          <td>
                            <div className="table-actions">
                              <button className="view-button">Просмотр</button>
                              <button className="edit-item-button">Редактировать</button>
                              <button className="delete-item-button">Удалить</button>
                            </div>
                          </td>
                        )}
                        {!editMode && (
                          <td>
                            <button className="view-button">Просмотр</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="tab-content">
              <h3>Расписание</h3>

              <div className="schedule-tabs">
                <button className="schedule-tab active">Распорядок дня</button>
                <button className="schedule-tab">Расписание занятий</button>
              </div>

              <div className="daily-schedule">
                <h4>Распорядок дня</h4>
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Время</th>
                      <th>Активность</th>
                      {editMode && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {group.dailySchedule.map((item, index) => (
                      <tr key={index}>
                        <td>{editMode ? <input type="text" defaultValue={item.time} /> : item.time}</td>
                        <td>{editMode ? <input type="text" defaultValue={item.activity} /> : item.activity}</td>
                        {editMode && (
                          <td>
                            <button className="delete-item-button">Удалить</button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {editMode && (
                      <tr>
                        <td colSpan={3}>
                          <button className="add-schedule-button">+ Добавить пункт</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="weekly-schedule">
                <h4>Расписание занятий</h4>
                <div className="weekly-schedule-grid">
                  {group.weeklySchedule.map((day, index) => (
                    <div key={index} className="day-schedule">
                      <h5>{day.day}</h5>
                      <ul className="activities-list">
                        {day.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="activity-item">
                            <span className="activity-time">{activity.time}</span>
                            <span className="activity-name">
                              {editMode ? <input type="text" defaultValue={activity.name} /> : activity.name}
                            </span>
                            {editMode && <button className="delete-item-button">✕</button>}
                          </li>
                        ))}
                        {editMode && (
                          <li className="add-activity">
                            <button className="add-activity-button">+ Добавить занятие</button>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="tab-content">
              <div className="announcements-header">
                <h3>Объявления и новости</h3>
              </div>

              {editMode && (
                <div className="add-announcement-form">
                  <h4>Добавить новое объявление</h4>
                  <div className="form-group">
                    <label>Заголовок:</label>
                    <input
                      type="text"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      placeholder="Введите заголовок..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Содержание:</label>
                    <textarea
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      placeholder="Введите текст объявления..."
                      rows={4}
                    />
                  </div>
                  <button className="add-announcement-button" onClick={handleAddAnnouncement}>
                    Опубликовать объявление
                  </button>
                </div>
              )}

              <div className="announcements-list">
                {group.announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-header">
                      <h4>{announcement.title}</h4>
                      <div className="announcement-meta">
                        <span className="announcement-date">
                          {new Date(announcement.date).toLocaleDateString("ru-RU")}
                        </span>
                        <span className="announcement-author">{announcement.author}</span>
                      </div>
                    </div>
                    <div className="announcement-content">{announcement.content}</div>
                    {editMode && (
                      <div className="announcement-actions">
                        <button className="edit-item-button">Редактировать</button>
                        <button className="delete-item-button">Удалить</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
 
  )
}
