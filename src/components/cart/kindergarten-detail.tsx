import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { message } from "antd";
import "../../styles/kindergarten-detail.css";
import { EventData } from "../../types/event.type";
import dayjs from 'dayjs';  // Для ES-модулей

const KindergartenDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  const [kindergarten, setKindergarten] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    founded_by: "",
    сapacity: "",
    time_working: "",
    director: "",
    description: "",
    address: "",
    phone: "",
    email: ""
  });
  const [childrenCount, setChildrenCount] = useState(0);

  const countChildrenInKindergarten = () => {
    const childrenData = localStorage.getItem('children');
    console.log( childrenData)
  
    if (!childrenData) return 0;
    
    try {
      const childrenList = JSON.parse(childrenData);
      let a =childrenList.data.filter((child: any) => 
        child.attributes.kindergartens_id=== id
      ).length;
    
      return  a
   
    } catch (e) {
      console.error("Ошибка при подсчёте детей", e);
      return 0;
    }
  };

  useEffect(() => {
    setChildrenCount(countChildrenInKindergarten());
  }, []);

  const [eventsForKindergarten, setEventsForKindergarten] = useState<EventData[]>([])

  useEffect(() => {
    const storedData = localStorage.getItem("events");
    if (!storedData) return;
  
    let eventsList = JSON.parse(storedData);
 
    // Фильтруем по детскому саду
    const filteredEvents = eventsList.filter(
      (event: { attributes: { kinddergarten_id: string | undefined; }; }) =>
        event.attributes.kinddergarten_id === id // ← ваш ID детсада
    );

    console.log(filteredEvents)
  
    setEventsForKindergarten(filteredEvents);
  }, [id])

  // Загружаем данные из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kindergartens");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const found = list.find((kg: any) => kg.id === id);
        if (found) {
          setKindergarten(found);
          setEditData({
            title: found.attributes.title,
            founded_by: found.attributes.founded_by,
            сapacity: found.attributes.сapacity,
            time_working: found.attributes.time_working,
            director: found.attributes.director,
            description: found.description,
            address: found.attributes.address,
            phone: found.attributes.phone,
            email: found.attributes.email
          });
         
        } else {
          message.warning("Детский сад не найден, используются демо-данные");
        }
      } catch (e) {
        console.error("Ошибка парсинга localStorage", e);
        message.error("Ошибка загрузки данных");
      }
    } else {
      message.warning("Нет данных, используются демо-данные");
    }
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    const saved = localStorage.getItem("kindergartens");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const updatedList = list.map((kg: any) => {
          if (kg.id === id) {
            return {
              ...kg,
              attributes: {
                ...kg.attributes,
                title: editData.title,
                founded_by: editData.founded_by,
                сapacity: editData.сapacity,
                time_working: editData.time_working,
                director: editData.director,
                address: editData.address,
                phone: editData.phone,
                email: editData.email
              },
              description: editData.description
            };
          }
          return kg;
        });
        
        localStorage.setItem("kindergartens", JSON.stringify(updatedList));
        setKindergarten(updatedList.find((kg: any) => kg.id === id));
        setIsEditing(false);
        message.success("Изменения сохранены");
      } catch (e) {
        console.error("Ошибка сохранения данных", e);
        message.error("Ошибка сохранения данных");
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (kindergarten) {
      setEditData({
        title: kindergarten.attributes.title,
        founded_by: kindergarten.attributes.founded_by,
        сapacity: kindergarten.attributes.сapacity,
        time_working: kindergarten.attributes.time_working,
        director: kindergarten.attributes.director,
        description: kindergarten.description,
        address: kindergarten.attributes.address,
        phone: kindergarten.attributes.phone,
        email: kindergarten.attributes.email
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderEditableField = (label: string, name: string, value: string, multiline = false) => {
    if (isEditing) {
      return (
        <div className="info-item">
          <span className="info-label">{label}</span>
          {multiline ? (
            <textarea
              name={name}
              value={value}
              onChange={handleInputChange}
              className="info-edit-input"
            />
          ) : (
            <input
              type="text"
              name={name}
              value={value}
              onChange={handleInputChange}
              className="info-edit-input"
            />
          )}
        </div>
      );
    }
    return (
      <div className="info-item">
        <span className="info-label">{label}</span>
        <span className="info-value">{value}</span>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!kindergarten) return <div>Нет данных</div>;

    switch (activeTab) {
      case "info":
        return (
          <div className="tab-content">
            <h3>Общая информация</h3>
            <div className="info-grid">
              {renderEditableField("Название:", "title", editData.title)}
              {renderEditableField("Основан:", "founded_by", editData.founded_by)}
              {renderEditableField("Вместимость:", "сapacity", editData.сapacity)}
              <div className="info-item">
                <span className="info-label">Текущая наполняемость:</span>
                <span className="info-value">{childrenCount} детей</span>
              </div>
              <div className="info-item">
                <span className="info-label">Заполненность:</span>
                <span className="info-value">
                  {Math.round(
                    (childrenCount / kindergarten.attributes.сapacity) * 100
                  )}
                  %
                </span>
              </div>
              {renderEditableField("Часы работы:", "time_working", editData.time_working)}
              {renderEditableField("Директор:", "director", editData.director)}
            </div>

            <div className="mt-5 info-section">
              <h3>Описание</h3>
              {renderEditableField("", "description", editData.description, true)}
            </div>

            <div className="info-section">
              <h3>Контактная информация</h3>
              <div className="contact-info">
                {renderEditableField("Адрес:", "address", editData.address)}
                {renderEditableField("Телефон:", "phone", editData.phone)}
                {renderEditableField("Email:", "email", editData.email)}
              </div>
            </div>
          </div>
        );

        case "events":
       

          return (
            <div className="tab-content">
              <h3>Предстоящие события</h3>
        
              {eventsForKindergarten.length === 0 ? (
                <p>Нет запланированных событий для этого детского сада.</p>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Название</th>
                      <th>Время</th>
                   
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsForKindergarten.map((event) => {
                      const date = new Date(event.attributes.date);
                      const formattedDate = date.toLocaleDateString("ru-RU");
                      const startTime = dayjs(event.attributes.datetime_start).format("HH:mm");
                      const endTime = dayjs(event.attributes.datetime_end).format("HH:mm");
        
                      return (
                        <tr key={event.id} >
                          <td>{formattedDate}</td>
                          <td>{event.attributes.title}</td>
                          <td>{startTime} – {endTime}</td>
                          <td>
                            <span className="">
                              {event.attributes.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );

      default:
        return <div>Выберите вкладку для просмотра информации</div>;
    }
  };

  if (!kindergarten) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="kindergarten-detail-container w-100">
      <div className="kindergarten-header">
        <div className="kindergarten-title">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="title-edit-input"
            />
          ) : (
            <h2>{kindergarten.attributes.title}</h2>
          )}
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={editData.address}
              onChange={handleInputChange}
              className="address-edit-input"
            />
          ) : (
            <p className="kindergarten-address">{kindergarten.attributes.address}</p>
          )}
        </div>
        <div className="kindergarten-stats">
          <div className="stat-item">
            <span className="stat-value">{childrenCount}</span>
            <span className="stat-label">Детей</span>
          </div>
        </div>
      </div>

      <div className="kindergarten-tabs">
        <button
          className={`tab-button ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Информация
        </button>
        <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Мероприятия
        </button>
        
      </div>

      <div className="kindergarten-content">{renderTabContent()}</div>

      <div className="action-buttons">
        {isEditing ? (
          <>
            <button className="action-button save-button" onClick={handleSaveClick}>
              Сохранить изменения
            </button>
            <button className="action-button cancel-button" onClick={handleCancelClick}>
              Отменить
            </button>
          </>
        ) : (
          <>
            <button className="action-button edit-button" onClick={handleEditClick}>
              Редактировать информацию
            </button>
            <button
              className="action-button contact-button"
              onClick={() => window.history.back()}
            >
              Назад к списку
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default KindergartenDetail;