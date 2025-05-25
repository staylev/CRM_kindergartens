
import { useState } from "react"
import "../../styles/event-detail-page.css"
import { useNavigate } from "react-router-dom"

// Пример данных о событии
const sampleEvent = {
  id: "E001",
  title: "Осенний утренник",
  type: "Праздник",
  description:
    "Традиционный осенний утренник с участием детей старшей и подготовительной групп. Праздник включает в себя театрализованное представление, песни, танцы и игры на осеннюю тематику.",
  status: "Запланировано",
  date: "2023-10-25",
  timeStart: "10:00",
  timeEnd: "11:30",
  location: "Музыкальный зал",
  coverImage: "/placeholder.svg?height=300&width=600",
  organizer: "Петрова Елена Ивановна",
  groups: ["Старшая группа 'Солнышко'", "Подготовительная группа 'Звездочки'"],
  participants: {
    staff: [
      {
        id: "T001",
        name: "Петрова Елена Ивановна",
        position: "Музыкальный руководитель",
        role: "Организатор",
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "T002",
        name: "Иванова Ольга Петровна",
        position: "Воспитатель",
        role: "Ведущая",
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "T003",
        name: "Сидорова Марина Александровна",
        position: "Воспитатель",
        role: "Помощник",
        photo: "/placeholder.svg?height=50&width=50",
      },
    ],
    children: 45,
    parents: 30,
  },
  schedule: [
    {
      time: "09:30 - 10:00",
      activity: "Подготовка зала, проверка оборудования",
      responsible: "Петрова Е.И., Сидорова М.А.",
    },
    {
      time: "10:00 - 10:10",
      activity: "Вступительное слово, приветствие гостей",
      responsible: "Иванова О.П.",
    },
    {
      time: "10:10 - 10:40",
      activity: "Театрализованное представление 'Осенняя сказка'",
      responsible: "Петрова Е.И., дети старшей группы",
    },
    {
      time: "10:40 - 11:00",
      activity: "Песни и танцы на осеннюю тематику",
      responsible: "Дети подготовительной группы",
    },
    {
      time: "11:00 - 11:20",
      activity: "Игры и конкурсы с родителями",
      responsible: "Иванова О.П., Сидорова М.А.",
    },
    {
      time: "11:20 - 11:30",
      activity: "Заключительное слово, вручение подарков",
      responsible: "Иванова О.П.",
    },
  ],
  resources: [
    {
      category: "Оборудование",
      items: [
        { name: "Музыкальный центр", quantity: 1, status: "Подтверждено" },
        { name: "Микрофоны", quantity: 2, status: "Подтверждено" },
        { name: "Проектор", quantity: 1, status: "Требуется проверка" },
      ],
    },
    {
      category: "Декорации",
      items: [
        { name: "Осенние листья (комплект)", quantity: 3, status: "Подтверждено" },
        { name: "Фигуры овощей и фруктов", quantity: 10, status: "В процессе подготовки" },
        { name: "Баннер 'Осенний праздник'", quantity: 1, status: "Подтверждено" },
      ],
    },
    {
      category: "Костюмы",
      items: [
        { name: "Костюм Осени", quantity: 1, status: "Подтверждено" },
        { name: "Костюмы овощей", quantity: 6, status: "В процессе подготовки" },
        { name: "Костюмы животных", quantity: 4, status: "Требуется проверка" },
      ],
    },
  ],
  budget: {
    planned: 15000,
    spent: 8500,
    items: [
      { name: "Материалы для декораций", amount: 3500, status: "Оплачено" },
      { name: "Ткани для костюмов", amount: 5000, status: "Оплачено" },
      { name: "Подарки детям", amount: 6500, status: "Запланировано" },
    ],
  },
  photos: [
    { id: "P001", url: "/placeholder.svg?height=200&width=300", description: "Репетиция танца" },
    { id: "P002", url: "/placeholder.svg?height=200&width=300", description: "Подготовка декораций" },
    { id: "P003", url: "/placeholder.svg?height=200&width=300", description: "Примерка костюмов" },
  ],
  notes: [
    {
      id: "N001",
      date: "2023-10-01",
      author: "Петрова Е.И.",
      text: "Репетиции идут по плану. Дети хорошо запоминают слова песен и движения танцев.",
    },
    {
      id: "N002",
      date: "2023-10-05",
      author: "Иванова О.П.",
      text: "Необходимо уточнить количество родителей, которые будут присутствовать на мероприятии.",
    },
    {
      id: "N003",
      date: "2023-10-10",
      author: "Сидорова М.А.",
      text: "Костюмы почти готовы, осталось доделать несколько элементов для костюмов овощей.",
    },
  ],
}

export default function EventDetailPage() {
  const [event, setEvent] = useState(sampleEvent)
  const [activeTab, setActiveTab] = useState("info")
  const [editMode, setEditMode] = useState(false)
  const [newNote, setNewNote] = useState("")

  // Добавление новой заметки
  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedEvent = {
        ...event,
        notes: [
          {
            id: `N00${event.notes.length + 1}`,
            date: new Date().toISOString().split("T")[0],
            author: "Текущий пользователь",
            text: newNote,
          },
          ...event.notes,
        ],
      }
      setEvent(updatedEvent)
      setNewNote("")
    }
  }

  // Расчет прогресса подготовки
  const calculateProgress = () => {
    let total = 0
    let completed = 0

    event.resources.forEach((category) => {
      category.items.forEach((item) => {
        total++
        if (item.status === "Подтверждено") completed++
      })
    })

    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  // Расчет оставшегося бюджета
  const calculateRemainingBudget = () => {
    const spent = event.budget.items.reduce((sum, item) => (item.status === "Оплачено" ? sum + item.amount : sum), 0)
    return event.budget.planned - spent
  }

  const navigate = useNavigate()

  return (
    <div className="event-detail-container">
      <header className="event-detail-header">
        <div className="header-content">
          <h1>Информация о событии</h1>
          <div className="header-actions">
          <button className="edit-button" onClick={() => navigate("/events")}>
               назад к списку
           </button>
            <button className="edit-button" onClick={() => setEditMode(!editMode)}>
              {editMode ? "Сохранить" : "Редактировать"}
            </button>
            <button className="print-button">Печать</button>
          </div>
        </div>
      </header>

      <div className="event-detail-content">
        <div className="event-sidebar">
          <div className="event-status-container">
            <div className={`event-status ${event.status.toLowerCase()}`}>
              <span>{event.status}</span>
            </div>
            <h2>{event.title}</h2>
            <p className="event-id">ID: {event.id}</p>
            <p className="event-type">{event.type}</p>
            <div className="event-date-time">
              <div className="event-date">
                <i className="event-icon date-icon"></i>
                <span>{new Date(event.date).toLocaleDateString("ru-RU")}</span>
              </div>
              <div className="event-time">
                <i className="event-icon time-icon"></i>
                <span>
                  {event.timeStart} - {event.timeEnd}
                </span>
              </div>
              <div className="event-location">
                <i className="event-icon location-icon"></i>
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <nav className="event-tabs">
            <button
              className={`tab-button ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Общая информация
            </button>
            <button
              className={`tab-button ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              Расписание
            </button>
            <button
              className={`tab-button ${activeTab === "participants" ? "active" : ""}`}
              onClick={() => setActiveTab("participants")}
            >
              Участники
            </button>
            <button
              className={`tab-button ${activeTab === "resources" ? "active" : ""}`}
              onClick={() => setActiveTab("resources")}
            >
              Ресурсы и бюджет
            </button>
            <button
              className={`tab-button ${activeTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveTab("photos")}
            >
              Фотографии
            </button>
            <button
              className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              Заметки
            </button>
          </nav>

          <div className="event-progress">
            <h4>Прогресс подготовки</h4>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
            <p>{calculateProgress()}% выполнено</p>
          </div>
        </div>

        <div className="event-main-content">
          {activeTab === "info" && (
            <div className="tab-content">
              <div className="event-cover">
                <img src={event.coverImage || "/placeholder.svg"} alt={event.title} />
                {editMode && <button className="change-cover-button">Изменить обложку</button>}
              </div>

              <h3>Общая информация</h3>
              <div className="info-grid">
                <div className="info-group">
                  <label>Название события:</label>
                  {editMode ? <input type="text" defaultValue={event.title} /> : <span>{event.title}</span>}
                </div>
                <div className="info-group">
                  <label>Тип события:</label>
                  {editMode ? (
                    <select defaultValue={event.type}>
                      <option value="Праздник">Праздник</option>
                      <option value="Утренник">Утренник</option>
                      <option value="Родительское собрание">Родительское собрание</option>
                      <option value="Мастер-класс">Мастер-класс</option>
                      <option value="Экскурсия">Экскурсия</option>
                      <option value="Другое">Другое</option>
                    </select>
                  ) : (
                    <span>{event.type}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Статус:</label>
                  {editMode ? (
                    <select defaultValue={event.status}>
                      <option value="Запланировано">Запланировано</option>
                      <option value="В процессе подготовки">В процессе подготовки</option>
                      <option value="Готово к проведению">Готово к проведению</option>
                      <option value="Завершено">Завершено</option>
                      <option value="Отменено">Отменено</option>
                    </select>
                  ) : (
                    <span>{event.status}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Дата проведения:</label>
                  {editMode ? (
                    <input type="date" defaultValue={event.date} />
                  ) : (
                    <span>{new Date(event.date).toLocaleDateString("ru-RU")}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Время начала:</label>
                  {editMode ? <input type="time" defaultValue={event.timeStart} /> : <span>{event.timeStart}</span>}
                </div>
                <div className="info-group">
                  <label>Время окончания:</label>
                  {editMode ? <input type="time" defaultValue={event.timeEnd} /> : <span>{event.timeEnd}</span>}
                </div>
                <div className="info-group">
                  <label>Место проведения:</label>
                  {editMode ? <input type="text" defaultValue={event.location} /> : <span>{event.location}</span>}
                </div>
                <div className="info-group">
                  <label>Организатор:</label>
                  {editMode ? <input type="text" defaultValue={event.organizer} /> : <span>{event.organizer}</span>}
                </div>
                <div className="info-group full-width">
                  <label>Описание:</label>
                  {editMode ? <textarea defaultValue={event.description} rows={4} /> : <span>{event.description}</span>}
                </div>
              </div>

              <h4>Группы-участники</h4>
              <div className="groups-list">
                {event.groups.map((group, index) => (
                  <div key={index} className="group-tag">
                    {group}
                    {editMode && <button className="remove-group-button">×</button>}
                  </div>
                ))}
                {editMode && (
                  <div className="add-group">
                    <select>
                      <option value="">Выберите группу</option>
                      <option value="Младшая группа 'Ладушки'">Младшая группа "Ладушки"</option>
                      <option value="Средняя группа 'Почемучки'">Средняя группа "Почемучки"</option>
                    </select>
                    <button className="add-group-button">Добавить</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="tab-content">
              <h3>Расписание мероприятия</h3>
              <div className="schedule-actions">
                {editMode && <button className="add-button">+ Добавить пункт</button>}
              </div>

              <div className="timeline">
                {event.schedule.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-time">
                      {editMode ? <input type="text" defaultValue={item.time} /> : <span>{item.time}</span>}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-activity">
                        {editMode ? <input type="text" defaultValue={item.activity} /> : <h4>{item.activity}</h4>}
                      </div>
                      <div className="timeline-responsible">
                        <label>Ответственные:</label>
                        {editMode ? (
                          <input type="text" defaultValue={item.responsible} />
                        ) : (
                          <span>{item.responsible}</span>
                        )}
                      </div>
                      {editMode && (
                        <div className="timeline-actions">
                          <button className="edit-item-button">Редактировать</button>
                          <button className="delete-item-button">Удалить</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "participants" && (
            <div className="tab-content">
              <h3>Участники мероприятия</h3>

              <div className="participants-summary">
                <div className="participant-count">
                  <div className="count-icon staff-icon"></div>
                  <div className="count-info">
                    <span className="count-number">{event.participants.staff.length}</span>
                    <span className="count-label">Сотрудников</span>
                  </div>
                </div>
                <div className="participant-count">
                  <div className="count-icon children-icon"></div>
                  <div className="count-info">
                    <span className="count-number">{event.participants.children}</span>
                    <span className="count-label">Детей</span>
                  </div>
                </div>
                <div className="participant-count">
                  <div className="count-icon parents-icon"></div>
                  <div className="count-info">
                    <span className="count-number">{event.participants.parents}</span>
                    <span className="count-label">Родителей</span>
                  </div>
                </div>
              </div>

              <h4>Персонал</h4>
              <div className="staff-actions">
                {editMode && <button className="add-button">+ Добавить сотрудника</button>}
              </div>

              <div className="staff-list">
                {event.participants.staff.map((staff) => (
                  <div key={staff.id} className="staff-card">
                    <div className="staff-photo">
                      <img src={staff.photo || "/placeholder.svg"} alt={staff.name} />
                    </div>
                    <div className="staff-info">
                      <h5>{staff.name}</h5>
                      <p className="staff-position">{staff.position}</p>
                      <p className="staff-role">
                        <span>Роль в мероприятии:</span> {staff.role}
                      </p>
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

              <h4>Дети и родители</h4>
              <div className="attendance-actions">
                {editMode && (
                  <>
                    <button className="add-button">Управление списком детей</button>
                    <button className="add-button">Управление списком родителей</button>
                  </>
                )}
              </div>

              <div className="attendance-info">
                <p>
                  В мероприятии участвуют <strong>{event.participants.children}</strong> детей из{" "}
                  <strong>{event.groups.length}</strong> групп.
                </p>
                <p>
                  Планируется присутствие <strong>{event.participants.parents}</strong> родителей.
                </p>
                {editMode && (
                  <div className="attendance-edit">
                    <div className="form-group">
                      <label>Количество детей:</label>
                      <input type="number" defaultValue={event.participants.children} min="0" />
                    </div>
                    <div className="form-group">
                      <label>Количество родителей:</label>
                      <input type="number" defaultValue={event.participants.parents} min="0" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="tab-content">
              <h3>Ресурсы и материалы</h3>

              {event.resources.map((category, categoryIndex) => (
                <div key={categoryIndex} className="resource-category">
                  <div className="category-header">
                    <h4>{category.category}</h4>
                    {editMode && <button className="add-button">+ Добавить</button>}
                  </div>
                  <div className="resources-table-container">
                    <table className="resources-table">
                      <thead>
                        <tr>
                          <th>Наименование</th>
                          <th>Количество</th>
                          <th>Статус</th>
                          {editMode && <th>Действия</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {category.items.map((item, itemIndex) => (
                          <tr key={itemIndex}>
                            <td>{editMode ? <input type="text" defaultValue={item.name} /> : item.name}</td>
                            <td>
                              {editMode ? <input type="number" defaultValue={item.quantity} min="1" /> : item.quantity}
                            </td>
                            <td>
                              {editMode ? (
                                <select defaultValue={item.status}>
                                  <option value="Подтверждено">Подтверждено</option>
                                  <option value="В процессе подготовки">В процессе подготовки</option>
                                  <option value="Требуется проверка">Требуется проверка</option>
                                  <option value="Отсутствует">Отсутствует</option>
                                </select>
                              ) : (
                                <span className={`resource-status ${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                                  {item.status}
                                </span>
                              )}
                            </td>
                            {editMode && (
                              <td>
                                <div className="table-actions">
                                  <button className="delete-item-button">Удалить</button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <h3>Бюджет мероприятия</h3>
              <div className="budget-summary">
                <div className="budget-item">
                  <span className="budget-label">Запланировано:</span>
                  <span className="budget-value">{event.budget.planned.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">Потрачено:</span>
                  <span className="budget-value">{event.budget.spent.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">Осталось:</span>
                  <span className="budget-value">{calculateRemainingBudget().toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              <div className="budget-details">
                <div className="category-header">
                  <h4>Статьи расходов</h4>
                  {editMode && <button className="add-button">+ Добавить</button>}
                </div>
                <div className="budget-table-container">
                  <table className="budget-table">
                    <thead>
                      <tr>
                        <th>Наименование</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        {editMode && <th>Действия</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {event.budget.items.map((item, index) => (
                        <tr key={index}>
                          <td>{editMode ? <input type="text" defaultValue={item.name} /> : item.name}</td>
                          <td className="amount-cell">
                            {editMode ? (
                              <input type="number" defaultValue={item.amount} min="0" />
                            ) : (
                              `${item.amount.toLocaleString("ru-RU")} ₽`
                            )}
                          </td>
                          <td>
                            {editMode ? (
                              <select defaultValue={item.status}>
                                <option value="Оплачено">Оплачено</option>
                                <option value="Запланировано">Запланировано</option>
                              </select>
                            ) : (
                              <span className={`budget-status ${item.status.toLowerCase()}`}>{item.status}</span>
                            )}
                          </td>
                          {editMode && (
                            <td>
                              <div className="table-actions">
                                <button className="delete-item-button">Удалить</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="tab-content">
              <div className="photos-header">
                <h3>Фотографии мероприятия</h3>
                {editMode && <button className="add-button">+ Добавить фото</button>}
              </div>

              <div className="photos-grid">
                {event.photos.map((photo) => (
                  <div key={photo.id} className="photo-card">
                    <div className="photo-container">
                      <img src={photo.url || "/placeholder.svg"} alt={photo.description} />
                      {editMode && (
                        <div className="photo-actions">
                          <button className="edit-photo-button">Изменить</button>
                          <button className="delete-photo-button">Удалить</button>
                        </div>
                      )}
                    </div>
                    <div className="photo-description">
                      {editMode ? <input type="text" defaultValue={photo.description} /> : <p>{photo.description}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {editMode && (
                <div className="upload-photos">
                  <div className="upload-area">
                    <div className="upload-icon"></div>
                    <p>Перетащите фотографии сюда или нажмите для выбора файлов</p>
                    <input type="file" multiple accept="image/*" className="file-input" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="tab-content">
              <div className="notes-header">
                <h3>Заметки и комментарии</h3>
              </div>

              {editMode && (
                <div className="add-note-form">
                  <h4>Добавить новую заметку</h4>
                  <textarea
                    placeholder="Введите текст заметки..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                  />
                  <button className="add-note-button" onClick={handleAddNote}>
                    Добавить заметку
                  </button>
                </div>
              )}

              <div className="notes-list">
                {event.notes.map((note) => (
                  <div key={note.id} className="note-card">
                    <div className="note-header">
                      <div className="note-meta">
                        <span className="note-date">{new Date(note.date).toLocaleDateString("ru-RU")}</span>
                        <span className="note-author">{note.author}</span>
                      </div>
                      {editMode && (
                        <div className="note-actions">
                          <button className="edit-item-button">Редактировать</button>
                          <button className="delete-item-button">Удалить</button>
                        </div>
                      )}
                    </div>
                    <div className="note-content">
                      {editMode ? <textarea defaultValue={note.text} rows={3} /> : <p>{note.text}</p>}
                    </div>
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
