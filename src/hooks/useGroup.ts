import { useMutation, useQueryClient } from '@tanstack/react-query';
import {  GroupData, ListGroups } from '../types/Groups..type';
import { addGroup, deleteGroup, GetGroups, UpdateGroup } from '../api/Groups.api';
import { useState } from 'react';

export const useGroups = () => {
    const queryClient = useQueryClient();
    const [transformedData, setTransformedData] = useState<ListGroups | null>(null);
  
    const GroupListMutation = useMutation<ListGroups, Error>({
      mutationFn: () => GetGroups.list(),
      onSuccess: (data) => {
        
        const transformedData = transformData(data);
        setTransformedData(transformedData); 

        console.log('Данные успешно загружены:', transformedData);
        queryClient.setQueryData(['Group'], transformedData);
        queryClient.invalidateQueries({ queryKey: ['Group'] });
      },
      onError: (error) => {
        console.error('Ошибка при загрузке списка групп:', error.message);
      },
    });

  // Функция для преобразования данных
  const transformData = (data: ListGroups): ListGroups => {
    return {
      ...data,
      data: data.data.map((group) => {
        // Находим соответствующий детский сад в included
        const kindergarten = data.included.find(
          (item: { id: any; }) => item.id === group.relationships.kindergarten.data.id
        );

        // Добавляем kindergarten_title в attributes
        return {
          ...group,
          attributes: {
            ...group.attributes,
            kindergarten_title: kindergarten ? kindergarten.attributes.title : 'Не указано',
          },
        };
      }),
    };
  };
  
    const addKGroupMutation = useMutation<void, Error, GroupData>({
      mutationFn: (newGroup) => addGroup(newGroup),
          onSuccess: () => {
            // Инвалидируем кэш, чтобы обновить список детских садов
            queryClient.invalidateQueries({ queryKey: ['Group'] });
          },      
          onError: (error) => {
        console.error('Ошибка при добавлении группы:', error.message);
      },
    });

     const deleteGroupMutation = useMutation<void, Error, string>({
      mutationFn: (id) => deleteGroup(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Group'] });
      },
      onError: (error) => {
        console.error('Ошибка при удалении группы', error.message);
      },
    });
    
    const UpdateGroupMutation = useMutation<void, Error, { id: string; Update: GroupData }>({
      mutationFn: ({ id, Update }) => UpdateGroup(id, Update),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Group'] });
      },
      onError: (error) => {
        console.error('Ошибка при обновлении детского сада', error.message);
      },
    });
    
    return {
      UpdateGroupMutation,
      deleteGroupMutation,
      addKGroupMutation,
      GroupListMutation,
      isPending: GroupListMutation.isPending,
      isError: GroupListMutation.isError,
      isSuccess: GroupListMutation.isSuccess,
      data: GroupListMutation.data,
      transformedData,
      error: GroupListMutation.error,
    };

  };
 
