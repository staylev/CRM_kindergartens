"use client"

import { useEffect, useState } from "react"
import "../../styles/kindergarten-detail.css"
import { useNavigate, useParams } from "react-router-dom"
import { useKindergartens } from "../../hooks/usekindergarten"
import { Kindergartens, KindergartenDetaildata } from "../../types/kindergartens.type";
import { demokindergartenData } from "../../DemoData/demoData"
import { message } from "antd"
 
// Демонстрационные данные


const KindergartenDetail = () => {
  const [activeTab, setActiveTab] = useState("info")
  const [kindergartenData, setKindergartenData] = useState(demokindergartenData);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
 const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { kindergartensListMutation } = useKindergartens();

  useEffect(() => {
    const fetchKindergartenData = async () => {
      try {
        setIsLoading(true);
        // Получаем список всех детских садов
        const data = await kindergartensListMutation.mutateAsync();
        
        // Находим детский сад по ID из URL
        const foundKindergarten = data.data.find((kg: Kindergartens) => kg.id === id);
        
        if (foundKindergarten) {
          // Форматируем данные из API в нужный нам формат
          const formattedData: KindergartenDetaildata = {
            ...demokindergartenData, // берем все демо-поля
            id: foundKindergarten.id,
            name: foundKindergarten.attributes.title,
            address: foundKindergarten.attributes.address,
          };          
          setKindergartenData(formattedData);
        } else {
          message.warning("Детский сад не найден, используются демо-данные");
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setIsError(true);
        message.error("Ошибка при загрузке данных, используются демо-данные");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKindergartenData();
  }, [id]);

  const renderTabContent = () => {
    if (isLoading) return <div>Загрузка данных...</div>;
    if (isError) return <div>Ошибка загрузки данных</div>;
    switch (activeTab) {
      case "info":
        return (
          <div className="tab-content ">
            <div className="info-section">
              <h3>Общая информация</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Основан:</span>
                  <span className="info-value">{kindergartenData.foundedYear}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Вместимость:</span>
                  <span className="info-value">{kindergartenData.capacity} детей</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Текущая наполняемость:</span>
                  <span className="info-value">{kindergartenData.currentEnrollment} детей</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Заполненность:</span>
                  <span className="info-value">
                    {Math.round((kindergartenData.currentEnrollment / kindergartenData.capacity) * 100)}%
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Часы работы:</span>
                  <span className="info-value">{kindergartenData.openingHours}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Директор:</span>
                  <span className="info-value">{kindergartenData.director}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Описание</h3>
              <p>{kindergartenData.description}</p>
            </div>

            <div className="info-section">
              <h3>Инфраструктура</h3>
              <div className="facilities-list">
                {kindergartenData.facilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    {facility}
                  </div>
                ))}
              </div>
            </div>

            <div className="info-section">
              <h3>Контактная информация</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Адрес:</span>
                  <span className="contact-value">{kindergartenData.address}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Телефон:</span>
                  <span className="contact-value">{kindergartenData.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{kindergartenData.email}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case "programs":
        return (
          <div className="tab-content">
            <h3>Программы и группы</h3>
            <div className="programs-container">
              {kindergartenData.programs.map((program, index) => (
                <div key={index} className="program-card">
                  <h4>{program.name}</h4>
                  <div className="program-stats">
                    <div className="program-stat">
                      <span className="stat-label">Детей:</span>
                      <span className="stat-value">{program.students}</span>
                    </div>
                    <div className="program-stat">
                      <span className="stat-label">Вместимость:</span>
                      <span className="stat-value">
                        {Math.round(kindergartenData.capacity / kindergartenData.programs.length)}
                      </span>
                    </div>
                    <div className="program-stat">
                      <span className="stat-label">Заполненность:</span>
                      <span className="stat-value">
                        {Math.round(
                          (program.students / (kindergartenData.capacity / kindergartenData.programs.length)) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="program-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.round((program.students / (kindergartenData.capacity / kindergartenData.programs.length)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "staff":
        return (
          <div className="tab-content">
            <h3>Сотрудники</h3>
            <div className="staff-grid">
              {kindergartenData.staff.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-photo">
                    <img src={staff.photo || "/placeholder.svg"} alt={staff.name} />
                  </div>
                  <div className="staff-info">
                    <h4>{staff.name}</h4>
                    <p>{staff.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "events":
        return (
          <div className="tab-content">
            <h3>Предстоящие события</h3>
            <div className="events-list">
              {kindergartenData.events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-date">
                    <div className="event-month">
                      {new Date(event.date).toLocaleString("ru-RU", { month: "short" })}
                    </div>
                    <div className="event-day">{new Date(event.date).getDate()}</div>
                  </div>
                  <div className="event-details">
                    <h4>{event.name}</h4>
                    <p>{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "gallery":
        return (
          <div className="tab-content">
            <h3>Фотогалерея</h3>
            <div className="gallery-grid">
              {kindergartenData.photos.map((photo, index) => (
                <div key={index} className="gallery-item">
                  <img src={photo || "/placeholder.svg"} alt={`Фото детского сада ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Выберите вкладку для просмотра информации</div>
    }
  }

  return (
 
      <div className="kindergarten-detail-container w-100">
      <div className="kindergarten-header">
        <div className="kindergarten-title">
          <h2>{kindergartenData.name}</h2>
          <p className="kindergarten-address">{kindergartenData.address}</p>
        </div>
        <div className="kindergarten-stats">
          <div className="stat-item">
            <span className="stat-value">{kindergartenData.currentEnrollment}</span>
            <span className="stat-label">Детей</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{kindergartenData.staff.length}</span>
            <span className="stat-label">Сотрудников</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{kindergartenData.programs.length}</span>
            <span className="stat-label">Программ</span>
          </div>
        </div>
      </div>

      <div className="kindergarten-tabs">
        <button className={`tab-button ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
          Информация
        </button>
        <button
          className={`tab-button ${activeTab === "programs" ? "active" : ""}`}
          onClick={() => setActiveTab("programs")}
        >
          Программы
        </button>
        <button className={`tab-button ${activeTab === "staff" ? "active" : ""}`} onClick={() => setActiveTab("staff")}>
          Сотрудники
        </button>
        <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          События
        </button>
        <button
          className={`tab-button ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          Галерея
        </button>
      </div>

      <div className="kindergarten-content">{renderTabContent()}</div>

      <div className="action-buttons">
        <button className="action-button edit-button">Редактировать информацию</button>
        <button className="action-button contact-button"
        onClick={() => navigate("/Kindergartens")}>Назад к списку</button>
      </div>
    </div>
 
    
  )
}

export default KindergartenDetail
