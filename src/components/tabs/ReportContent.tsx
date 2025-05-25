"use client"

import { SetStateAction, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import "../../styles/reports-page.css"

// Моковые данные для посещаемости
const attendanceData = [
  { месяц: "Янв", количество: 65 },
  { месяц: "Фев", количество: 59 },
  { месяц: "Мар", количество: 80 },
  { месяц: "Апр", количество: 81 },
  { месяц: "Май", количество: 56 },
  { месяц: "Июн", количество: 55 },
]

// Моковые данные для оплат
const paymentData = [
  { месяц: "Янв", сумма: 4000 },
  { месяц: "Фев", сумма: 3000 },
  { месяц: "Мар", сумма: 5000 },
  { месяц: "Апр", сумма: 4500 },
  { месяц: "Май", сумма: 3500 },
  { месяц: "Июн", сумма: 4200 },
]

// Моковые данные для распределения по группам
const groupData = [
  { название: "Группа 1", количество: 20 },
  { название: "Группа 2", количество: 15 },
  { название: "Группа 3", количество: 18 },
  { название: "Группа 4", количество: 12 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function ReportContent() {
  const [dateRange, setDateRange] = useState({ start: "2023-01-01", end: "2023-06-30" })
  const [reportType, setReportType] = useState("посещаемость")

  const handleDateChange = (e: { target: { name: any; value: any } }) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value })
  }

  const handleReportTypeChange = (e: { target: { value: SetStateAction<string> } }) => {
    setReportType(e.target.value)
  }

  const handleGenerateReport = () => {
    // Здесь будет логика генерации отчета
    console.log("Генерация отчета:", reportType, dateRange)
  }

  const handleExportReport = (format: string) => {
    // Здесь будет логика экспорта отчета
    console.log("Экспорт отчета в формате:", format)
  }

  return (
    
    <div className="reports-container">
      <h1 className="reports-title">Отчеты и аналитика</h1>

      <div className="reports-controls">
        <div className="control-group">
          <label htmlFor="report-type">Тип отчета:</label>
          <select id="report-type" value={reportType} onChange={handleReportTypeChange} className="select-control">
            <option value="посещаемость">Посещаемость</option>
            <option value="оплаты">Оплаты</option>
            <option value="группы">Распределение по группам</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="start-date">Начальная дата:</label>
          <input
            type="date"
            id="start-date"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="date-control"
          />
        </div>

        <div className="control-group">
          <label htmlFor="end-date">Конечная дата:</label>
          <input
            type="date"
            id="end-date"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="date-control"
          />
        </div>

        <button className="generate-button" onClick={handleGenerateReport}>
          Сформировать отчет
        </button>
      </div>

      <div className="reports-content">
        {reportType === "посещаемость" && (
          <div className="report-section">
            <h2>Отчет по посещаемости</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="месяц" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="количество" name="Количество посещений" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="report-summary">
              <h3>Сводка по посещаемости</h3>
              <p>Общее количество посещений: {attendanceData.reduce((sum, item) => sum + item.количество, 0)}</p>
              <p>
                Средняя посещаемость в месяц:{" "}
                {Math.round(attendanceData.reduce((sum, item) => sum + item.количество, 0) / attendanceData.length)}
              </p>
              <p>
                Месяц с наибольшей посещаемостью:{" "}
                {attendanceData.reduce((max, item) => (max.количество > item.количество ? max : item)).месяц}
              </p>
            </div>
          </div>
        )}

        {reportType === "оплаты" && (
          <div className="report-section">
            <h2>Отчет по оплатам</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={paymentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="месяц" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="сумма" name="Сумма оплат (₽)" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="report-summary">
              <h3>Сводка по оплатам</h3>
              <p>Общая сумма оплат: {paymentData.reduce((sum, item) => sum + item.сумма, 0)} ₽</p>
              <p>
                Средняя сумма оплат в месяц:{" "}
                {Math.round(paymentData.reduce((sum, item) => sum + item.сумма, 0) / paymentData.length)} ₽
              </p>
              <p>
                Месяц с наибольшей суммой оплат:{" "}
                {paymentData.reduce((max, item) => (max.сумма > item.сумма ? max : item)).месяц}
              </p>
            </div>
          </div>
        )}

        {reportType === "группы" && (
          <div className="report-section">
            <h2>Распределение по группам</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={groupData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="количество"
                    nameKey="название"
                  >
                    {groupData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="report-summary">
              <h3>Сводка по группам</h3>
              <p>Общее количество детей: {groupData.reduce((sum, item) => sum + item.количество, 0)}</p>
              <p>Количество групп: {groupData.length}</p>
              <p>
                Самая большая группа:{" "}
                {groupData.reduce((max, item) => (max.количество > item.количество ? max : item)).название}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="export-controls">
        <h3>Экспорт отчета</h3>
        <div className="export-buttons">
          <button className="export-button" onClick={() => handleExportReport("pdf")}>
            Экспорт в PDF
          </button>
          <button className="export-button" onClick={() => handleExportReport("excel")}>
            Экспорт в Excel
          </button>
          <button className="export-button" onClick={() => handleExportReport("csv")}>
            Экспорт в CSV
          </button>
        </div>
      </div>
    </div>
  )
}
