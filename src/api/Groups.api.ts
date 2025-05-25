import { GroupData, ListGroups } from '../types/Groups..type';
import apiClient from './apiClient'

// Пример использования
export const GetGroups = {
  async list(): Promise<ListGroups> {
    try {
      const { data } = await apiClient.get<ListGroups>('/api/groups?include=kindergarten');
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке списка групп:', error);
      throw error;
    }
  },
};

export const addGroup = async (newGroup: GroupData) => {
  const response = await apiClient.post('/api/groups', {
    data: newGroup,
  });
  return response.data;
};

 
export const deleteGroup = async (obj_id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/groups/${obj_id}`);
  } catch (error) {
    console.error('Ошибка при удалении группы:', error);
    throw error;
  }
};

export const UpdateGroup= async (obj_id: string, Update: GroupData): Promise<void> => {
  try {
    await apiClient.patch(`/api/groups/${obj_id}`, {
      data: Update
    });
  } catch (error) {
    console.error('Ошибка при обновлении группы', error);
    throw error;
  }
};