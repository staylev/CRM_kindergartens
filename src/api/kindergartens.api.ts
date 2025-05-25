import { Listkindergartens, KindergartenData } from '../types/kindergartens.type';
import apiClient from './apiClient'

// Пример использования
export const Getkindergartens = {
  async list(): Promise<Listkindergartens> {
    try {
      const { data } = await apiClient.get<Listkindergartens>('/api/kindergartens');
      return data;
    } catch (error) {
      console.error('Ошибка при загрузке списка детских садов:', error);
      throw error;
    }
  },
};

export const addKindergarten = async (newKindergarten: KindergartenData) => {
  const response = await apiClient.post('/api/kindergartens', {
    data: newKindergarten,
  });
  return response.data;
};

export const getKindergartenById = async (obj_id: string): Promise<KindergartenData> => {
  const response = await apiClient.get<KindergartenData>(`/api/kindergartens/${obj_id}`);
  return response.data; // Возвращаем данные в формате KindergartenData
};

// Новая функция для удаления детского сада
export const deleteKindergarten = async (obj_id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/kindergartens/${obj_id}`);
  } catch (error) {
    console.error('Ошибка при удалении детского сада:', error);
    throw error;
  }
};

export const UpdateKindergarten = async (obj_id: string, Update: KindergartenData): Promise<void> => {
  try {
    await apiClient.patch(`/api/kindergartens/${obj_id}`, {
      data: Update
    });
  } catch (error) {
    console.error('Ошибка при обновлении детского сада', error);
    throw error;
  }
};