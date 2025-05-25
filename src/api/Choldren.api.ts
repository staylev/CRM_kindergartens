import { ChildData, ListChild } from "../types/children.types";
import apiClient from "./apiClient";


// Пример использования
export const GetChildren = {
  async list(): Promise<ListChild> {
    try {
      const { data } = await apiClient.get<ListChild>('/api/childs?include=group');
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке списка Детей:', error);
      throw error;
    }
  },
};

export const addChild = async (NewChild: ChildData) => {
  try {
    const response = await apiClient.post('/api/childs', {
      data: NewChild,
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
export const deleteChild = async (obj_id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/childs/${obj_id}`);
  } catch (error) {
    console.error('Ошибка при удалении ребёнка:', error);
    throw error;
  }
};

export const UpdateChild= async (obj_id: string, Update: ChildData): Promise<void> => {
  try {
    await apiClient.patch(`/api/childs/${obj_id}`, {
      data: Update
    });
  } catch (error) {
    console.error('Ошибка при обновлении Ребёнка', error);
    throw error;
  }
};