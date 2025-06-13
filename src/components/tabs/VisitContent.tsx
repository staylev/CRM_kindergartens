"use client"

import { useState, useEffect } from "react"
import "../../styles/attendance-system.css"


// Типы данных
interface Child {
  id: number
  name: string
  group: string
}

interface AttendanceRecord {
  id: number
  childId: number
  date: string
  present: boolean
}

interface Group {
  id: number
  name: string
}

// Компонент учета посещений
export default function VisitContent() {
  // Состояния
  const [activeTab, setActiveTab] = useState<"daily" | "history">("daily")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [children, setChildren] = useState<Child[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  // Используем нативный Date для работы с датами
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(2025, 3, 1), // Апрель 2025
    new Date(2025, 3, 30),
  ])

  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    const mockGroups: Group[] = [
      { id: 1, name: "Старшая группа" },
      { id: 2, name: "Средняя группа" },
      { id: 3, name: "Младшая группа" },
    ]
    setGroups(mockGroups)

    const mockChildren: Child[] = [
      { id: 1, name: "Анна Смирнова", group: "Старшая группа" },
      { id: 2, name: "Иван Петров", group: "Старшая группа" },
      { id: 3, name: "Мария Иванова", group: "Средняя группа" },
      { id: 4, name: "Алексей Сидоров", group: "Средняя группа" },
      { id: 5, name: "Екатерина Козлова", group: "Младшая группа" },
    ]
    setChildren(mockChildren)

    // Генерируем случайные записи посещаемости за апрель 2025
    const mockAttendance: AttendanceRecord[] = []

    // Создаем записи для всего апреля и мая 2025 (для демонстрации)
    for (let month = 3; month <= 4; month++) {
      // Апрель (3) и Май (4)
      const daysInMonth = new Date(2025, month + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(2025, month, day)

        // Пропускаем выходные дни (суббота и воскресенье)
        const dayOfWeek = date.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        for (const child of mockChildren) {
          // Для демонстрации создаем некоторые записи о посещениях
          // В реальном приложении эти данные пришли бы с сервера
          let present = Math.random() > 0.3 // 70% вероятность присутствия

          // Для демонстрации создаем шаблон посещений для апреля
          if (month === 3) {
            if (day === 8 || day === 9) {
              // 8-9 апреля - большинство детей присутствуют
              present = child.id !== 2 && child.id !== 5 && !(child.id === 3 && day === 9)
            } else if (day === 12) {
              // 12 апреля - никто еще не отмечен
              present = false
            }
          }

          const record: AttendanceRecord = {
            id: mockAttendance.length + 1,
            childId: child.id,
            date: formatDate(date),
            present: present,
          }
          mockAttendance.push(record)
        }
      }
    }

    setAttendanceRecords(mockAttendance)
  }, [])

  // Форматирование даты в строку YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Форматирование даты для отображения DD.MM
  const formatDisplayShortDate = (dateStr: string): string => {
    const [ month, day] = dateStr.split("-")
    return `${day}.${month}`
  }

  // Форматирование даты для отображения DD.MM.YYYY
  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Получение дней месяца
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Получение дня недели для первого дня месяца
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay() || 7 // Преобразуем 0 (воскресенье) в 7 для соответствия русской неделе
  }

  // Получение статуса посещения для ребенка на определенную дату
  const getAttendanceStatus = (childId: number, date: Date): boolean | null => {
    const dateStr = formatDate(date)
    const record = attendanceRecords.find((record) => record.childId === childId && record.date === dateStr)
    return record ? record.present : null
  }

  // Отметка посещения
  const markAttendance = (childId: number, date: Date, present: boolean) => {
    const dateStr = formatDate(date)
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.childId === childId && record.date === dateStr,
    )

    const updatedRecords = [...attendanceRecords]

    if (existingRecordIndex >= 0) {
      // Обновляем существующую запись
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        present,
      }
    } else {
      // Создаем новую запись
      const newRecord: AttendanceRecord = {
        id: Date.now(),
        childId,
        date: dateStr,
        present,
      }
      updatedRecords.push(newRecord)
    }

    setAttendanceRecords(updatedRecords)
  }

  // Фильтрация детей по группе
  const getFilteredChildren = () => {
    if (selectedGroup === "all") return children
    return children.filter((child) => child.group === selectedGroup)
  }

  // Получение количества присутствующих детей на выбранную дату
  const getPresentChildrenCount = () => {
    const dateStr = formatDate(selectedDate)
    return attendanceRecords.filter((record) => record.date === dateStr && record.present).length
  }

  // Получение дат для истории посещений на основе выбранного диапазона
  const getHistoryDates = () => {
    const dates = []
    const startDate = dateRange[0]
    const endDate = dateRange[1]

    // Создаем массив дат от начальной до конечной
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      // Пропускаем выходные
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(formatDate(new Date(currentDate)))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  // Отображение календаря
  const renderCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Добавляем пустые ячейки для дней до начала месяца
    for (let i = 1; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Добавляем дни предыдущего месяца
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

    for (let i = 0; i < firstDayOfMonth - 1; i++) {
      const day = daysInPrevMonth - (firstDayOfMonth - 2) + i
      days.push(
        <div key={`prev-${day}`} className="calendar-day other-month">
          {day}
        </div>,
      )
    }

    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected =
        day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()

      days.push(
        <div key={day} className={`calendar-day ${isSelected ? "selected" : ""}`} onClick={() => setSelectedDate(date)}>
          {day}
        </div>,
      )
    }

    // Добавляем дни следующего месяца
    const nextMonthDays = 42 - days.length // 6 рядов по 7 дней
    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div key={`next-${day}`} className="calendar-day other-month">
          {day}
        </div>,
      )
    }

    return days
  }

  // Получение названия месяца
  const getMonthName = (month: number): string => {
    const months = [
      "январь",
      "февраль",
      "март",
      "апрель",
      "май",
      "июнь",
      "июль",
      "август",
      "сентябрь",
      "октябрь",
      "ноябрь",
      "декабрь",
    ]
    return months[month]
  }

  // Получение названия дня недели
  // const getDayOfWeekName = (day: number): string => {
  //   const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  //   return days[day]
  // }

  // Изменение месяца
  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setSelectedDate(newDate)
  }

  // Отображение ежедневного учета
  const renderDailyAttendance = () => {
    const filteredChildren = getFilteredChildren()
    const formattedDate = selectedDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    return (
      <div className="attendance-content">
        <div className="attendance-sidebar">
          <div className="calendar-container">
            <h2>Календарь</h2>
            <p className="calendar-subtitle">Выберите дату для отметки посещений</p>

            <div className="month-navigation">
              <button onClick={() => changeMonth(-1)} className="month-nav-button">
                &lt;
              </button>
              <div className="current-month">
                {getMonthName(selectedDate.getMonth())} {selectedDate.getFullYear()}
              </div>
              <button onClick={() => changeMonth(1)} className="month-nav-button">
                &gt;
              </button>
            </div>

            <div className="calendar-grid">
              <div className="weekday">пн</div>
              <div className="weekday">вт</div>
              <div className="weekday">ср</div>
              <div className="weekday">чт</div>
              <div className="weekday">пт</div>
              <div className="weekday">сб</div>
              <div className="weekday">вс</div>

              {renderCalendar()}
            </div>
          </div>
        </div>

        <div className="attendance-main">
          <div className="attendance-header">
            <h2>Посещения на {formattedDate}</h2>
            <p className="attendance-subtitle">Отметьте присутствующих детей</p>

            <div className="attendance-filters">
              <div className="group-filter">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Все группы</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          <div className="attendance-table">
            <table>
              <thead>
                <tr>
                  <th>Имя ребенка</th>
                  <th>Группа</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredChildren
                  .filter((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((child) => {
                    const status = getAttendanceStatus(child.id, selectedDate)
                    return (
                      <tr key={child.id}>
                        <td>{child.name}</td>
                        <td>{child.group}</td>
                        <td className={status === true ? "status-present" : ""}>
                          {status === true ? "Присутствует" : "Не отмечен"}
                        </td>
                        <td>
                          <button
                            className="attendance-button"
                            onClick={() => markAttendance(child.id, selectedDate, true)}
                          >
                            Отметить присутствие
                          </button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          <div className="attendance-summary">
            <div>Всего детей: {getFilteredChildren().length}</div>
            <div>Присутствует: {getPresentChildrenCount()}</div>
          </div>
        </div>
      </div>
    )
  }

  // Создаем собственный компонент выбора диапазона дат
  const CustomRangePicker = () => {
    const [showPicker, setShowPicker] = useState(false)
    const [tempStartDate, setTempStartDate] = useState<Date>(dateRange[0])
    const [tempEndDate, setTempEndDate] = useState<Date>(dateRange[1])

    const handleApply = () => {
      setDateRange([tempStartDate, tempEndDate])
      setShowPicker(false)
    }

    return (
      <div className="custom-range-picker">
        <div className="date-display" onClick={() => setShowPicker(!showPicker)}>
          <span className="date-icon">📅</span>
          <span>
            {formatDisplayDate(dateRange[0])} - {formatDisplayDate(dateRange[1])}
          </span>
        </div>

        {showPicker && (
          <div className="date-picker-dropdown">
            <div className="date-picker-header">
              <h3>Выберите период</h3>
            </div>

            <div className="date-inputs">
              <div className="date-input-group">
                <label>Начало:</label>
                <input
                  type="date"
                  value={formatDate(tempStartDate)}
                  onChange={(e) => setTempStartDate(new Date(e.target.value))}
                />
              </div>

              <div className="date-input-group">
                <label>Конец:</label>
                <input
                  type="date"
                  value={formatDate(tempEndDate)}
                  onChange={(e) => setTempEndDate(new Date(e.target.value))}
                />
              </div>
            </div>

            <div className="date-picker-actions">
              <button className="cancel-btn" onClick={() => setShowPicker(false)}>
                Отмена
              </button>
              <button className="apply-btn" onClick={handleApply}>
                Применить
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Отображение истории посещений
  const renderAttendanceHistory = () => {
    const filteredChildren = getFilteredChildren()
    const historyDates = getHistoryDates()

    return (
      <div className="history-content">
        <div className="history-header">
          <h2>История посещений</h2>
          <p className="history-subtitle">Просмотр и фильтрация истории посещений</p>

          <div className="history-filters">
            <div className="date-range-filter">
              <CustomRangePicker />
            </div>

            <div className="group-filter">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="filter-select"
              >
                <option value="all">Все группы</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-filter">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th className="name-column">Имя ребенка</th>
                <th className="group-column">Группа</th>
                {historyDates.map((date) => (
                  <th key={date} className="date-column">
                    {formatDisplayShortDate(date)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredChildren
                .filter((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((child) => (
                  <tr key={child.id}>
                    <td className="name-column">{child.name}</td>
                    <td className="group-column">{child.group}</td>
                    {historyDates.map((date) => {
                      const record = attendanceRecords.find((r) => r.childId === child.id && r.date === date)

                      let statusClass = "status-dot"
                      if (record) {
                        statusClass += record.present ? " present" : " absent"
                      }

                      return (
                        <td key={date} className="date-column">
                          <div className={statusClass}></div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="history-footer">
          <div className="record-count">Всего записей: {filteredChildren.length * historyDates.length}</div>
          <button className="export-button">
            <span className="export-icon">⬇️</span> Экспорт
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="attendance-system">
      <h1 className="system-title">Учет посещений детского сада</h1>

      <div className="tabs">
        <button className={`tab ${activeTab === "daily" ? "active" : ""}`} onClick={() => setActiveTab("daily")}>
          Ежедневный учет
        </button>
        <button className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          История посещений
        </button>
      </div>

      <div className="content">{activeTab === "daily" ? renderDailyAttendance() : renderAttendanceHistory()}</div>
    </div>
  )
}
