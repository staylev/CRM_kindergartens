import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {EventData, ListEvent } from "../types/event.type";
import { addEvent, deleteEvent, GetEvents, UpdateEvent } from "../api/event.api";

 
export const useEvent = () => {
    const queryClient = useQueryClient();
    const [transformedData, setTransformedData] = useState<ListEvent | null>(null);
  
    const EventListMutation = useMutation<ListEvent, Error>({
      mutationFn: () => GetEvents.list(),
      onSuccess: (data) => {
        
        const transformedData = transformData(data);
        setTransformedData(transformedData); 

        console.log('Данные успешно загружены:', transformedData);
        queryClient.setQueryData(['event'], transformedData);
        queryClient.invalidateQueries({ queryKey: ['event'] });
      },
      onError: (error) => {
        console.error('Ошибка при загрузке списка мероприятий:', error.message);
      },
    });

  // Функция для преобразования данных
  const transformData = (data: ListEvent): ListEvent => {
    return {
      ...data,
      data: data.data.map((e) => { // Explicitly define the type of 'e' as 'events'
        // Находим соответствующий детский сад в included
        const group = data.included.find(
          (item: { id: any; }) => item.id === e.relationships.group.data.id
        );
        const child = data.included.find(
          (item: { id: any; }) => item.id === e.relationships.child.data.id
        );
  
        // Добавляем kindergarten_title в attributes
        return {
          ...e,
          attributes: {
            ...e.attributes,
            group_title: group ? group.attributes.title : 'Не указано',
            child_last_name: child ? child.attributes.last_name : 'Не указано',
          },
        };
      }),
    };
  };
    
   const addEventMutation = useMutation<void, Error, EventData>({
    mutationFn: (newEvent) => addEvent(newEvent),
    onSuccess: () => {
      // Инвалидируем кэш, чтобы обновить список детских садов
      // queryClient.invalidateQueries({ queryKey: ['childs'] });
    },      
    onError: (error) => {
      console.error('Ошибка при добавлении мероприятия:', error.message);
    },
  });

  const deleteEventMutation = useMutation<void, Error, string>({
    mutationFn: (id) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
    onError: (error) => {
      console.error('Ошибка при удалении мероприятия', error.message);
    },
  });

  const UpdateEventMutation = useMutation<void, Error, { id: string; Update: EventData }>({
    mutationFn: ({ id, Update }) => UpdateEvent(id, Update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
    onError: (error) => {
      console.error('Ошибка при обновлении', error.message);
    },
  });

  return {
    UpdateEventMutation,
     deleteEventMutation,
    addEventMutation,
    EventListMutation,
    isPending: EventListMutation.isPending,
    isError: EventListMutation.isError,
    isSuccess: EventListMutation.isSuccess,
    data: EventListMutation.data,
    transformedData,
    error: EventListMutation.error,
  };
  };