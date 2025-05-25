import { EventData, ListEvent } from "../types/event.type";
import apiClient from "./apiClient";

 

// Пример использования
export const GetEvents = {
  async list(): Promise<ListEvent> {
    try {
      const { data } = await apiClient.get<ListEvent>('/api/events?include=child,group');
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке списка мероприятий:', error);
      throw error;
    }
  },
};

export const addEvent = async (newEvent: EventData) => {
  try {
    const response = await apiClient.post('/api/events', {
      data: newEvent,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response: { status: number; statusText: string; data: any } };
      console.error('Ошибка:', axiosError.response.status, axiosError.response.statusText);
      console.error('Дополнительная информация:', axiosError.response.data);
    } else {
      console.error('Ошибка:', error);
    }
    throw error;
  }
}; 
export const deleteEvent = async (obj_id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/events/${obj_id}`);
  } catch (error) {
    console.error('Ошибка при удалении мероприятия:', error);
    throw error;
  }
};

export const UpdateEvent= async (obj_id: string, Update: EventData): Promise<void> => {
  try {
    await apiClient.patch(`/api/events/${obj_id}`, {
      data: Update
    });
  } catch (error) {
    console.error('Ошибка при обновлении мероприятия', error);
    throw error;
  }
};