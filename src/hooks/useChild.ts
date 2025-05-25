import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChildData, ListChild } from "../types/children.types";
import { addChild, deleteChild, GetChildren, UpdateChild } from "../api/Choldren.api";

export const useChild = () => {
    const queryClient = useQueryClient();
    const [transformedData, setTransformedData] = useState<ListChild | null>(null);
  
    const ChildListMutation = useMutation<ListChild, Error>({
      mutationFn: () => GetChildren.list(),
      onSuccess: (data) => {
        
        const transformedData = transformData(data);
        setTransformedData(transformedData); 

        console.log('Данные успешно загружены:', transformedData);
        queryClient.setQueryData(['Child'], transformedData);
        queryClient.invalidateQueries({ queryKey: ['Child'] });
      },
      onError: (error) => {
        console.error('Ошибка при загрузке списка групп:', error.message);
      },
    });

  // Функция для преобразования данных
  const transformData = (data: ListChild): ListChild => {
    return {
        ...data,
        data: data.data.map((child) => {
          // Находим соответствующий детский сад в included
          const group = data.included.find(
            (item: { id: any; }) => item.id === child.relationships.group.data.id
          );
  
          // Добавляем kindergarten_title в attributes
          return {
            ...child,
            attributes: {
              ...child.attributes,
              group_title: group ? group.attributes.title : 'Не указано',
            },
          };
        }),
      };
    };
    
   const addChildMutation = useMutation<void, Error, ChildData>({
    mutationFn: (NewChild) => addChild(NewChild),
    onSuccess: () => {
      // Инвалидируем кэш, чтобы обновить список детских садов
      // queryClient.invalidateQueries({ queryKey: ['childs'] });
    },      
    onError: (error) => {
      console.error('Ошибка при добавлении ребёнка:', error.message);
    },
  });

  const deleteChildMutation = useMutation<void, Error, string>({
    mutationFn: (id) => deleteChild(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childs'] });
    },
    onError: (error) => {
      console.error('Ошибка при удалении ребёнка', error.message);
    },
  });

  const UpdateChildMutation = useMutation<void, Error, { id: string; Update: ChildData }>({
    mutationFn: ({ id, Update }) => UpdateChild(id, Update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Child'] });
    },
    onError: (error) => {
      console.error('Ошибка при обновлении', error.message);
    },
  });

  return {
    UpdateChildMutation,
    deleteChildMutation,
    addChildMutation,
    ChildListMutation,
    isPending: ChildListMutation.isPending,
    isError: ChildListMutation.isError,
    isSuccess: ChildListMutation.isSuccess,
    data: ChildListMutation.data,
    transformedData,
    error: ChildListMutation.error,
  };
  };