"use client"

import { useState, useEffect } from "react"
import "../../styles/financial-management.css"

// Типы данных
interface Invoice {
  id: string
  childName: string
  groupName: string
  parentName: string
  amount: number
  description: string
  issueDate: string
  dueDate: string
  status: "Ожидает оплаты" | "Частично оплачено" | "Оплачено"
  payments: Payment[]
}

interface Payment {
  id: string
  date: string
  amount: number
  method: string
  comment: string
}

export default function FinanceContent() {
  // Состояния
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("все")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("текущий месяц")

  // Состояния для нового счета
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, "id" | "payments" | "status">>({
    childName: "",
    groupName: "",
    parentName: "",
    amount: 0,
    description: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  })

  // Состояние для новой оплаты
  const [newPayment, setNewPayment] = useState<Omit<Payment, "id">>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    method: "Наличные",
    comment: "",
  })

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // Загрузка данных (имитация)
  useEffect(() => {
    // В реальном приложении здесь был бы запрос к API
    const mockInvoices: Invoice[] = [
      {
        id: "INV-2025-001",
        childName: "Иванов Петр",
        groupName: "Старшая группа",
        parentName: "Иванова Мария",
        amount: 5000,
        description: "Оплата за апрель 2025",
        issueDate: "2025-04-01",
        dueDate: "2025-04-15",
        status: "Оплачено",
        payments: [
          {
            id: "p1",
            date: "2025-04-05",
            amount: 5000,
            method: "Банковский перевод",
            comment: "Оплата за апрель",
          },
        ],
      },
      {
        id: "INV-2025-002",
        childName: "Петрова Анна",
        groupName: "Средняя группа",
        parentName: "Петров Сергей",
        amount: 6000,
        description: "Оплата за апрель 2025",
        issueDate: "2025-04-01",
        dueDate: "2025-04-15",
        status: "Ожидает оплаты",
        payments: [],
      },
      {
        id: "INV-2025-003",
        childName: "Сидоров Алексей",
        groupName: "Младшая группа",
        parentName: "Сидорова Елена",
        amount: 5500,
        description: "Оплата за апрель 2025",
        issueDate: "2025-04-01",
        dueDate: "2025-04-15",
        status: "Частично оплачено",
        payments: [
          {
            id: "p2",
            date: "2025-04-07",
            amount: 2000,
            method: "Наличные",
            comment: "Частичная оплата",
          },
        ],
      },
      {
        id: "INV-2025-004",
        childName: "Козлова Мария",
        groupName: "Старшая группа",
        parentName: "Козлов Андрей",
        amount: 5000,
        description: "Оплата за апрель 2025",
        issueDate: "2025-04-01",
        dueDate: "2025-04-15",
        status: "Оплачено",
        payments: [
          {
            id: "p3",
            date: "2025-04-03",
            amount: 5000,
            method: "Банковская карта",
            comment: "Оплата за апрель",
          },
        ],
      },
      {
        id: "INV-2025-005",
        childName: "Новиков Дмитрий",
        groupName: "Средняя группа",
        parentName: "Новикова Ольга",
        amount: 6000,
        description: "Оплата за апрель 2025",
        issueDate: "2025-04-01",
        dueDate: "2025-04-15",
        status: "Ожидает оплаты",
        payments: [],
      },
    ]

    setInvoices(mockInvoices)
  }, [])

  // Обработчики событий
  const handleCreateInvoice = () => {
    const newId = `INV-2025-${String(invoices.length + 1).padStart(3, "0")}`
    const invoice: Invoice = {
      ...newInvoice,
      id: newId,
      status: "Ожидает оплаты",
      payments: [],
    }

    setInvoices([...invoices, invoice])
    setNewInvoice({
      childName: "",
      groupName: "",
      parentName: "",
      amount: 0,
      description: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
    })

    setShowCreateForm(false)
  }

  const handleAddPayment = () => {
    if (!selectedInvoice) return

    const newPaymentWithId = {
      ...newPayment,
      id: `p${Date.now()}`,
    }

    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.id === selectedInvoice.id) {
        const updatedPayments = [...invoice.payments, newPaymentWithId]
        const totalPaid = updatedPayments.reduce((sum, payment) => sum + payment.amount, 0)

        let newStatus: Invoice["status"] = "Ожидает оплаты"
        if (totalPaid >= invoice.amount) {
          newStatus = "Оплачено"
        } else if (totalPaid > 0) {
          newStatus = "Частично оплачено"
        }

        const updatedInvoice = {
          ...invoice,
          payments: updatedPayments,
          status: newStatus,
        }

        setSelectedInvoice(updatedInvoice)
        return updatedInvoice
      }
      return invoice
    })

    setInvoices(updatedInvoices)
    setNewPayment({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      method: "Наличные",
      comment: "",
    })
    setShowPaymentForm(false)
  }

  // Фильтрация счетов
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.groupName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "все" || invoice.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  // Расчет статистики
  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "Оплачено").length,
    partial: invoices.filter((i) => i.status === "Частично оплачено").length,
    unpaid: invoices.filter((i) => i.status === "Ожидает оплаты").length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: invoices.reduce((sum, i) => {
      const paidAmount = i.payments.reduce((pSum, p) => pSum + p.amount, 0)
      return sum + paidAmount
    }, 0),
  }

  return (
 
    <div className="financial-management">
      <header className="header">
        <h1>Финансовый учет</h1>
        <div className="period-selector">
          <label>Период:</label>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
            <option value="текущий месяц">Текущий месяц</option>
            <option value="прошлый месяц">Прошлый месяц</option>
            <option value="квартал">Текущий квартал</option>
            <option value="год">Текущий год</option>
          </select>
        </div>
      </header>

      <div className="dashboard">
        <div className="stats-container">
          <div className="stat-card">
            <h3>Всего счетов</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Оплачено</h3>
            <p className="stat-value">{stats.paid}</p>
          </div>
          <div className="stat-card">
            <h3>Частично</h3>
            <p className="stat-value">{stats.partial}</p>
          </div>
          <div className="stat-card">
            <h3>Ожидают оплаты</h3>
            <p className="stat-value">{stats.unpaid}</p>
          </div>
          <div className="stat-card total-amount">
            <h3>Общая сумма</h3>
            <p className="stat-value">{stats.totalAmount.toLocaleString()} ₽</p>
          </div>
          <div className="stat-card paid-amount">
            <h3>Оплачено</h3>
            <p className="stat-value">{stats.paidAmount.toLocaleString()} ₽</p>
          </div>
        </div>

        <div className="controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Поиск по имени, группе или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="все">Все статусы</option>
              <option value="ожидает оплаты">Ожидает оплаты</option>
              <option value="частично оплачено">Частично оплачено</option>
              <option value="оплачено">Оплачено</option>
            </select>
          </div>

          <div className="view-controls">
            <button
              className={`view-button ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
            >
              Карточки
            </button>
            <button
              className={`view-button ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              Таблица
            </button>
            <button className="create-button" onClick={() => setShowCreateForm(true)}>
              Создать счет
            </button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="invoice-cards">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className={`invoice-card status-${invoice.status.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="card-header">
                  <h3>{invoice.childName}</h3>
                  <span className="status-badge">{invoice.status}</span>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Группа:</strong> {invoice.groupName}
                  </p>
                  <p>
                    <strong>Родитель:</strong> {invoice.parentName}
                  </p>
                  <p>
                    <strong>Сумма:</strong> {invoice.amount.toLocaleString()} ₽
                  </p>
                  <p>
                    <strong>Описание:</strong> {invoice.description}
                  </p>
                </div>
                <div className="card-footer">
                  <div className="dates">
                    <span>
                      <strong>Выставлен:</strong> {formatDate(invoice.issueDate)}
                    </span>
                    <span>
                      <strong>Оплатить до:</strong> {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                  <div className="payment-info">
                    <span>
                      <strong>Оплачено:</strong>{" "}
                      {invoice.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ₽
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="invoice-table-container">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>№ счета</th>
                  <th>Ребенок</th>
                  <th>Группа</th>
                  <th>Родитель</th>
                  <th>Сумма</th>
                  <th>Описание</th>
                  <th>Выставлен</th>
                  <th>Оплатить до</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className={`status-${invoice.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    <td>{invoice.id}</td>
                    <td>{invoice.childName}</td>
                    <td>{invoice.groupName}</td>
                    <td>{invoice.parentName}</td>
                    <td>{invoice.amount.toLocaleString()} ₽</td>
                    <td>{invoice.description}</td>
                    <td>{formatDate(invoice.issueDate)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td>
                      <span className="status-badge">{invoice.status}</span>
                    </td>
                    <td>
                      <button className="action-button" onClick={() => setSelectedInvoice(invoice)}>
                        Подробнее
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно создания счета */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Создание нового счета</h2>
              <button className="close-button" onClick={() => setShowCreateForm(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Ребенок:</label>
                  <input
                    type="text"
                    value={newInvoice.childName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, childName: e.target.value })}
                    placeholder="ФИО ребенка"
                  />
                </div>
                <div className="form-group">
                  <label>Группа:</label>
                  <select
                    value={newInvoice.groupName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, groupName: e.target.value })}
                  >
                    <option value="">Выберите группу</option>
                    <option value="Младшая группа">Младшая группа</option>
                    <option value="Средняя группа">Средняя группа</option>
                    <option value="Старшая группа">Старшая группа</option>
                    <option value="Подготовительная группа">Подготовительная группа</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Родитель:</label>
                  <input
                    type="text"
                    value={newInvoice.parentName}
                    onChange={(e) => setNewInvoice({ ...newInvoice, parentName: e.target.value })}
                    placeholder="ФИО родителя"
                  />
                </div>
                <div className="form-group">
                  <label>Сумма:</label>
                  <input
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    placeholder="Сумма в рублях"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Описание:</label>
                <input
                  type="text"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  placeholder="Описание платежа"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Дата выставления:</label>
                  <input
                    type="date"
                    value={newInvoice.issueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Срок оплаты:</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="primary-button"
                onClick={handleCreateInvoice}
                disabled={
                  !newInvoice.childName ||
                  !newInvoice.groupName ||
                  !newInvoice.parentName ||
                  !newInvoice.amount ||
                  !newInvoice.dueDate
                }
              >
                Создать счет
              </button>
              <button className="secondary-button" onClick={() => setShowCreateForm(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно детализации счета */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content invoice-details">
            <div className="modal-header">
              <h2>
                Счет №{selectedInvoice.id} - {selectedInvoice.childName}
              </h2>
              <button className="close-button" onClick={() => setSelectedInvoice(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-info-grid">
                <div className="info-section">
                  <h3>Информация о счете</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Ребенок:</span>
                      <span className="info-value">{selectedInvoice.childName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Группа:</span>
                      <span className="info-value">{selectedInvoice.groupName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Родитель:</span>
                      <span className="info-value">{selectedInvoice.parentName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Сумма:</span>
                      <span className="info-value">{selectedInvoice.amount.toLocaleString()} ₽</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Описание:</span>
                      <span className="info-value">{selectedInvoice.description}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Выставлен:</span>
                      <span className="info-value">{formatDate(selectedInvoice.issueDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Оплатить до:</span>
                      <span className="info-value">{formatDate(selectedInvoice.dueDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Статус:</span>
                      <span
                        className={`status-badge status-${selectedInvoice.status.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {selectedInvoice.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="payment-summary">
                  <h3>Сводка по оплате</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Сумма счета:</span>
                      <span className="summary-value">{selectedInvoice.amount.toLocaleString()} ₽</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Оплачено:</span>
                      <span className="summary-value">
                        {selectedInvoice.payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Осталось оплатить:</span>
                      <span className="summary-value">
                        {Math.max(
                          0,
                          selectedInvoice.amount - selectedInvoice.payments.reduce((sum, p) => sum + p.amount, 0),
                        ).toLocaleString()}{" "}
                        ₽
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="payments-history">
                <div className="section-header">
                  <h3>История платежей</h3>
                  <button className="add-button" onClick={() => setShowPaymentForm(true)}>
                    Добавить платеж
                  </button>
                </div>

                {selectedInvoice.payments.length === 0 ? (
                  <div className="empty-state">
                    <p>Платежи отсутствуют</p>
                  </div>
                ) : (
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Способ оплаты</th>
                        <th>Комментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{formatDate(payment.date)}</td>
                          <td>{payment.amount.toLocaleString()} ₽</td>
                          <td>{payment.method}</td>
                          <td>{payment.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Форма добавления платежа */}
                {showPaymentForm && (
                  <div className="payment-form">
                    <h4>Новый платеж</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Дата:</label>
                        <input
                          type="date"
                          value={newPayment.date}
                          onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Сумма:</label>
                        <input
                          type="number"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Способ оплаты:</label>
                        <select
                          value={newPayment.method}
                          onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                        >
                          <option value="Наличные">Наличные</option>
                          <option value="Банковский перевод">Банковский перевод</option>
                          <option value="Банковская карта">Банковская карта</option>
                          <option value="Электронный платеж">Электронный платеж</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Комментарий:</label>
                        <input
                          type="text"
                          value={newPayment.comment}
                          onChange={(e) => setNewPayment({ ...newPayment, comment: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button
                        className="primary-button"
                        onClick={handleAddPayment}
                        disabled={!newPayment.amount || newPayment.amount <= 0}
                      >
                        Сохранить платеж
                      </button>
                      <button className="secondary-button" onClick={() => setShowPaymentForm(false)}>
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="primary-button" onClick={() => setSelectedInvoice(null)}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
 
   
  )
}
