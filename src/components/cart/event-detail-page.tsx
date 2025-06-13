import { useEffect, useState } from "react";
import "../../styles/event-detail-page.css";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import dayjs from "dayjs";
import { events } from "../../types/event.type";


export default function EventDetailPage() {
  const [event, setEvent] = useState<events | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Инициализация данных из localStorage
  const initializeEventsData = () => {
    try {
      const storedData = localStorage.getItem("events");
      if (!storedData) return [];

      let parsed = JSON.parse(storedData);

      // Если это массив
      if (Array.isArray(parsed)) return parsed;

      // Если это объект с data
      if (parsed && parsed.data) return parsed.data;

      // Если это одно событие
      if (parsed && parsed.id) return [parsed];

      return [];
    } catch (error) {
      console.error("Ошибка чтения localStorage", error);
      return [];
    }
  };

  // Загрузка события
  useEffect(() => {
    const fetchEventData = () => {
      try {
        setLoading(true);
        const eventsData = initializeEventsData();
        const foundEvent = eventsData.find((e: any) => e.id === id);

        if (!foundEvent) {
          message.warning("Событие не найдено");
          navigate("/events");
          return;
        }

        // Нормализуем даты и структуру
        const normalizedEvent = {
          ...foundEvent,
          attributes: {
            ...foundEvent.attributes,
            datetime_start: new Date(foundEvent.attributes.datetime_start),
            datetime_end: new Date(foundEvent.attributes.datetime_end),
            date: new Date(foundEvent.attributes.date),
            status: foundEvent.attributes.status || "Запланировано",
          },
          relationships: {
            notes: Array.isArray(foundEvent.relationships?.notes)
              ? foundEvent.relationships.notes
              : [],
          },
        };

        setEvent(normalizedEvent);
      } catch (error) {
        console.error("Ошибка загрузки события", error);
        message.error("Не удалось загрузить событие");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, navigate]);

 
 
  // Сохранение изменений
  const handleSave = () => {
    if (!event) return;

    try {
      const updatedEvent = {
        ...event,
        attributes: {
          ...event.attributes,
          datetime_start: event.attributes.datetime_start.toISOString(),
          datetime_end: event.attributes.datetime_end.toISOString(),
          date: event.attributes.date.toISOString()
        }
      };

      const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
      const updatedList = storedEvents.map((e: any) =>
        e.id === event.id ? updatedEvent : e
      );

      localStorage.setItem("events", JSON.stringify(updatedList));
      message.success("Изменения сохранены");
      setEditMode(false);
    } catch (error) {
      message.error("Ошибка при сохранении");
    }
  };

  if (loading) return <div className="loading-container">Загрузка данных...</div>;
  if (!event) return <div className="error-container">Событие не найдено</div>;

  const startTime = dayjs(event.attributes.datetime_start).format("HH:mm");
  const endTime = dayjs(event.attributes.datetime_end).format("HH:mm");
  const eventDate = dayjs(event.attributes.datetime_start).format("DD.MM.YYYY");

  return (
    <div className="event-detail-container">
      <header className="event-detail-header">
        <div className="header-content">
          <h1>Информация о событии</h1>
          <div className="header-actions">
            <button className="edit-button" onClick={() => navigate("/events")}>
              назад к списку
            </button>
            <button
              className="edit-button"
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              {editMode ? "Сохранить" : "Редактировать"}
            </button>
          </div>
        </div>
      </header>
      <div className="event-detail-content">
        <div className="event-sidebar">
          <div className="event-status-container">
            <div className={`event-status ${event.attributes.status.toLowerCase()}`}>
              <span>{event.attributes.status}</span>
            </div>
            <h2>{event.attributes.title}</h2>
          </div>
        </div>
        <div className="event-main-content">
          {activeTab === "info" && (
            <div className="tab-content">
              <h3>Общая информация</h3>
              <div className="info-grid">
                {/* Поля редактирования */}
                <div className="info-group">
                  <label>Название:</label>
                  {editMode ? (
                    <input
                      value={event.attributes.title}
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          attributes: {
                            ...event.attributes,
                            title: e.target.value
                          }
                        })
                      }
                    />
                  ) : (
                    <span>{event.attributes.title}</span>
                  )}
                </div>

                

                <div className="info-group">
                  <label>Статус:</label>
                  {editMode ? (
                    <select
                      value={event.attributes.status}
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          attributes: {
                            ...event.attributes,
                            status: e.target.value
                          }
                        })
                      }
                    >
                      <option value="Запланировано">Запланировано</option>
                      <option value="В процессе подготовки">В процессе подготовки</option>
                      <option value="Готово к проведению">Готово к проведению</option>
                      <option value="Завершено">Завершено</option>
                      <option value="Отменено">Отменено</option>
                    </select>
                  ) : (
                    <span>{event.attributes.status}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Дата:</label>
                  {editMode ? (
                    <input
                      value={dayjs(event.attributes.date).format("YYYY-MM-DD")}
                      type="date"
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          attributes: {
                            ...event.attributes,
                            date: new Date(e.target.value)
                          }
                        })
                      }
                    />
                  ) : (
                    <span>{dayjs(event.attributes.date).format("DD.MM.YYYY")}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Время начала:</label>
                  {editMode ? (
                    <input
                      value={startTime}
                      type="date"
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          attributes: {
                            ...event.attributes,
                            datetime_start: new Date(e.target.value)
                          }
                        })
                      }
                    />
                  ) : (
                    <span>{startTime}</span>
                  )}
                </div>
                <div className="info-group">
                  <label>Время начала:</label>
                  {editMode ? (
                    <input
                      value={endTime}
                      type="date"
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          attributes: {
                            ...event.attributes,
                            datetime_end: new Date(e.target.value)
                          }
                        })
                      }
                    />
                  ) : (
                    <span>{endTime}</span>
                  )}
                </div>
                <div className="info-group">
                <label>Детский сад:</label>
                    <span>{event.attributes.kindergarten_title}</span>
                </div>
                <div className="info-group w-100">
                  <label>Описание:</label>
                  {editMode ? (
                    <textarea
                      value={event.attributes.description}
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          attributes: {
                            ...event.attributes,
                            description: e.target.value
                          }
                        })
                      }
                      rows={1}
                      cols={20}
                    />
                  ) : (
                    <span>{event.attributes.description}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}