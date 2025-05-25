"use client"

import { useState } from "react"
import "../../styles/parent-detail-page.css"
import { useNavigate } from "react-router-dom"

// Пример данных о родителе
const sampleParent = {
  id: "P001",
  firstName: "Елена",
  lastName: "Смирнова",
  middleName: "Александровна",
  relation: "Мать",
  photo: "/placeholder.svg?height=150&width=150",
  dateOfBirth: "1985-06-15",
  passport: "4510 123456",
  address: "ул. Ленина, 42, кв. 15",
  phone: "+7 (912) 345-67-89",
  email: "elena@example.com",
  workPlace: "ООО 'Технологии будущего'",
  workPosition: "Менеджер по персоналу",
  workPhone: "+7 (495) 123-45-67",
  children: [
    {
      id: "CH001",
      firstName: "Алексей",
      lastName: "Смирнов",
      age: 5,
      group: "Старшая группа 'Солнышко'",
      photo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "CH002",
      firstName: "Мария",
      lastName: "Смирнова",
      age: 3,
      group: "Младшая группа 'Звездочки'",
      photo: "/placeholder.svg?height=50&width=50",
    },
  ],
  payments: [
    {
      id: "PAY001",
      date: "2023-10-01",
      amount: 15000,
      purpose: "Оплата за октябрь 2023",
      status: "Оплачено",
      method: "Банковская карта",
    },
    {
      id: "PAY002",
      date: "2023-09-01",
      amount: 15000,
      purpose: "Оплата за сентябрь 2023",
      status: "Оплачено",
      method: "Банковская карта",
    },
    {
      id: "PAY003",
      date: "2023-08-01",
      amount: 15000,
      purpose: "Оплата за август 2023",
      status: "Оплачено",
      method: "Наличные",
    },
  ],
  documents: [
    {
      id: "DOC001",
      name: "Договор на оказание услуг",
      date: "2022-08-25",
      status: "Подписан",
      file: "contract.pdf",
    },
    {
      id: "DOC002",
      name: "Согласие на обработку персональных данных",
      date: "2022-08-25",
      status: "Подписан",
      file: "consent.pdf",
    },
    {
      id: "DOC003",
      name: "Медицинская карта",
      date: "2022-08-20",
      status: "Предоставлен",
      file: "medical.pdf",
    },
  ],
  communications: [
    {
      id: "COM001",
      date: "2023-10-10",
      type: "Телефонный звонок",
      subject: "Обсуждение подготовки к утреннику",
      content: "Родитель проинформирован о необходимости подготовить костюм к осеннему утреннику.",
      staff: "Петрова Е.И.",
    },
    {
      id: "COM002",
      date: "2023-09-15",
      type: "Личная встреча",
      subject: "Обсуждение успеваемости",
      content: "Проведена беседа о прогрессе ребенка в освоении программы. Родитель выразил удовлетворение.",
      staff: "Иванова О.П.",
    },
    {
      id: "COM003",
      date: "2023-09-05",
      type: "Email",
      subject: "Напоминание об оплате",
      content: "Отправлено напоминание о необходимости внести оплату за сентябрь.",
      staff: "Система",
    },
  ],
}

export default function ParentDetailPage() {
  const [parent, setParent] = useState(sampleParent)
  const [activeTab, setActiveTab] = useState("info")
  const [editMode, setEditMode] = useState(false)
  const [newCommunication, setNewCommunication] = useState({ type: "Телефонный звонок", subject: "", content: "" })

  // Добавление новой записи о коммуникации
  const handleAddCommunication = () => {
    if (newCommunication.subject.trim() && newCommunication.content.trim()) {
      const updatedParent = {
        ...parent,
        communications: [
          {
            id: `COM00${parent.communications.length + 1}`,
            date: new Date().toISOString().split("T")[0],
            type: newCommunication.type,
            subject: newCommunication.subject,
            content: newCommunication.content,
            staff: "Текущий пользователь",
          },
          ...parent.communications,
        ],
      }
      setParent(updatedParent)
      setNewCommunication({ type: "Телефонный звонок", subject: "", content: "" })
    }
  }
  const navigate = useNavigate()
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
              src={parent.photo || "/placeholder.svg"}
              alt={`${parent.firstName} ${parent.lastName}`}
              className="parent-photo"
            />
            {editMode && <button className="change-photo-button">Изменить фото</button>}
          </div>

          <div className="parent-quick-info">
            <h2>
              {parent.lastName} {parent.firstName} {parent.middleName}
            </h2>
            <p className="parent-id">ID: {parent.id}</p>
            <p className="parent-relation">{parent.relation}</p>
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
            <button
              className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              Платежи
            </button>
            <button
              className={`tab-button ${activeTab === "documents" ? "active" : ""}`}
              onClick={() => setActiveTab("documents")}
            >
              Документы
            </button>
            <button
              className={`tab-button ${activeTab === "communications" ? "active" : ""}`}
              onClick={() => setActiveTab("communications")}
            >
              Коммуникации
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
                  {editMode ? <input type="text" defaultValue={parent.lastName} /> : <span>{parent.lastName}</span>}
                </div>
                <div className="info-group">
                  <label>Имя:</label>
                  {editMode ? <input type="text" defaultValue={parent.firstName} /> : <span>{parent.firstName}</span>}
                </div>
                <div className="info-group">
                  <label>Отчество:</label>
                  {editMode ? <input type="text" defaultValue={parent.middleName} /> : <span>{parent.middleName}</span>}
                </div>
                <div className="info-group">
                  <label>Кем приходится:</label>
                  {editMode ? (
                    <select defaultValue={parent.relation}>
                      <option value="Мать">Мать</option>
                      <option value="Отец">Отец</option>
                      <option value="Бабушка">Бабушка</option>
                      <option value="Дедушка">Дедушка</option>
                      <option value="Опекун">Опекун</option>
                      <option value="Другое">Другое</option>
                    </select>
                  ) : (
                    <span>{parent.relation}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Дата рождения:</label>
                  {editMode ? (
                    <input type="date" defaultValue={parent.dateOfBirth} />
                  ) : (
                    <span>{new Date(parent.dateOfBirth).toLocaleDateString("ru-RU")}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Паспорт:</label>
                  {editMode ? <input type="text" defaultValue={parent.passport} /> : <span>{parent.passport}</span>}
                </div>
              </div>

              <h4>Контактная информация</h4>
              <div className="info-grid">
                <div className="info-group">
                  <label>Адрес:</label>
                  {editMode ? <input type="text" defaultValue={parent.address} /> : <span>{parent.address}</span>}
                </div>
                <div className="info-group">
                  <label>Телефон:</label>
                  {editMode ? <input type="tel" defaultValue={parent.phone} /> : <span>{parent.phone}</span>}
                </div>
                <div className="info-group">
                  <label>Email:</label>
                  {editMode ? <input type="email" defaultValue={parent.email} /> : <span>{parent.email}</span>}
                </div>
              </div>

              <h4>Информация о работе</h4>
              <div className="info-grid">
                <div className="info-group">
                  <label>Место работы:</label>
                  {editMode ? <input type="text" defaultValue={parent.workPlace} /> : <span>{parent.workPlace}</span>}
                </div>
                <div className="info-group">
                  <label>Должность:</label>
                  {editMode ? (
                    <input type="text" defaultValue={parent.workPosition} />
                  ) : (
                    <span>{parent.workPosition}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Рабочий телефон:</label>
                  {editMode ? <input type="tel" defaultValue={parent.workPhone} /> : <span>{parent.workPhone}</span>}
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
                    {parent.children.map((child) => (
                      <tr key={child.id}>
                        <td>
                          <div className="child-photo-cell">
                            <img src={child.photo || "/placeholder.svg"} alt={`${child.firstName} ${child.lastName}`} />
                          </div>
                        </td>
                        <td>{child.firstName}</td>
                        <td>{child.lastName}</td>
                        <td>{child.age} лет</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="tab-content">
              <div className="payments-header">
                <h3>История платежей</h3>
                {editMode && <button className="add-button">+ Добавить платеж</button>}
              </div>

              <div className="payments-filters">
                <select defaultValue="all">
                  <option value="all">Все платежи</option>
                  <option value="paid">Оплаченные</option>
                  <option value="pending">Ожидающие оплаты</option>
                  <option value="overdue">Просроченные</option>
                </select>
                <div className="date-range">
                  <input type="date" placeholder="От" />
                  <span>—</span>
                  <input type="date" placeholder="До" />
                </div>
              </div>

              <div className="payments-table-container">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Назначение</th>
                      <th>Сумма</th>
                      <th>Статус</th>
                      <th>Способ оплаты</th>
                      {editMode && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {parent.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.date).toLocaleDateString("ru-RU")}</td>
                        <td>{payment.purpose}</td>
                        <td className="amount-cell">{payment.amount.toLocaleString("ru-RU")} ₽</td>
                        <td>
                          <span className={`payment-status ${payment.status === "Оплачено" ? "paid" : "pending"}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td>{payment.method}</td>
                        {editMode && (
                          <td>
                            <div className="table-actions">
                              <button className="edit-item-button">Редактировать</button>
                              <button className="delete-item-button">Удалить</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="payment-summary">
                <div className="summary-item">
                  <span className="summary-label">Всего оплачено:</span>
                  <span className="summary-value">
                    {parent.payments
                      .filter((p) => p.status === "Оплачено")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString("ru-RU")}{" "}
                    ₽
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Ожидает оплаты:</span>
                  <span className="summary-value">
                    {parent.payments
                      .filter((p) => p.status !== "Оплачено")
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString("ru-RU")}{" "}
                    ₽
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="tab-content">
              <div className="documents-header">
                <h3>Документы</h3>
                {editMode && <button className="add-button">+ Добавить документ</button>}
              </div>

              <div className="documents-table-container">
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Дата</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parent.documents.map((document) => (
                      <tr key={document.id}>
                        <td>{document.name}</td>
                        <td>{new Date(document.date).toLocaleDateString("ru-RU")}</td>
                        <td>
                          <span
                            className={`document-status ${
                              document.status === "Подписан"
                                ? "signed"
                                : document.status === "Предоставлен"
                                  ? "provided"
                                  : "pending"
                            }`}
                          >
                            {document.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="view-button">Просмотр</button>
                            <button className="download-button">Скачать</button>
                            {editMode && <button className="delete-item-button">Удалить</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {editMode && (
                <div className="upload-document">
                  <h4>Загрузить новый документ</h4>
                  <div className="upload-form">
                    <div className="form-group">
                      <label>Название документа:</label>
                      <input type="text" placeholder="Введите название документа" />
                    </div>
                    <div className="form-group">
                      <label>Тип документа:</label>
                      <select>
                        <option value="contract">Договор</option>
                        <option value="consent">Согласие</option>
                        <option value="medical">Медицинский документ</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Файл:</label>
                      <div className="file-upload">
                        <input type="file" id="document-file" className="file-input" />
                        <label htmlFor="document-file" className="file-label">
                          Выберите файл
                        </label>
                        <span className="file-name">Файл не выбран</span>
                      </div>
                    </div>
                    <button className="upload-button">Загрузить документ</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "communications" && (
            <div className="tab-content">
              <div className="communications-header">
                <h3>История коммуникаций</h3>
              </div>

              {editMode && (
                <div className="add-communication-form">
                  <h4>Добавить новую запись</h4>
                  <div className="form-group">
                    <label>Тип коммуникации:</label>
                    <select
                      value={newCommunication.type}
                      onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value })}
                    >
                      <option value="Телефонный звонок">Телефонный звонок</option>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Личная встреча">Личная встреча</option>
                      <option value="Другое">Другое</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Тема:</label>
                    <input
                      type="text"
                      value={newCommunication.subject}
                      onChange={(e) => setNewCommunication({ ...newCommunication, subject: e.target.value })}
                      placeholder="Введите тему..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Содержание:</label>
                    <textarea
                      value={newCommunication.content}
                      onChange={(e) => setNewCommunication({ ...newCommunication, content: e.target.value })}
                      placeholder="Введите содержание коммуникации..."
                      rows={4}
                    />
                  </div>
                  <button className="add-communication-button" onClick={handleAddCommunication}>
                    Добавить запись
                  </button>
                </div>
              )}

              <div className="communications-list">
                {parent.communications.map((communication) => (
                  <div key={communication.id} className="communication-card">
                    <div className="communication-header">
                      <div className="communication-type-date">
                        <span className={`communication-type ${communication.type.toLowerCase().replace(" ", "-")}`}>
                          {communication.type}
                        </span>
                        <span className="communication-date">
                          {new Date(communication.date).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                      <h4>{communication.subject}</h4>
                    </div>
                    <div className="communication-content">{communication.content}</div>
                    <div className="communication-footer">
                      <span className="communication-staff">Сотрудник: {communication.staff}</span>
                      {editMode && (
                        <div className="communication-actions">
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
        </div>
      </div>
    </div>
  )
}
