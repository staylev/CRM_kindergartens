import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addKindergarten, deleteKindergarten, Getkindergartens, UpdateKindergarten } from '../api/kindergartens.api';
import {  KindergartenData, Listkindergartens } from '../types/kindergartens.type';

export const useKindergartens = () => {
    const queryClient = useQueryClient();
  
    const kindergartensListMutation = useMutation<Listkindergartens, Error>({
      mutationFn: () => Getkindergartens.list(),
      onSuccess: (data) => {
        queryClient.setQueryData(['kindergartens'], data);
        queryClient.invalidateQueries({ queryKey: ['kindergartens'] });
      },
      onError: (error) => {
        console.error('Ошибка при загрузке списка детских садов:', error.message);
      },
    });

    const addKindergartenMutation = useMutation<void, Error, KindergartenData>({
      mutationFn: (newKindergarten) => addKindergarten(newKindergarten),
          onSuccess: () => {
            // Инвалидируем кэш, чтобы обновить список детских садов
            queryClient.invalidateQueries({ queryKey: ['kindergartens'] });
          },      
          onError: (error) => {
        console.error('Ошибка при добавлении детского сада:', error.message);
      },
    });

     const deleteKindergartenMutation = useMutation<void, Error, string>({
      mutationFn: (id) => deleteKindergarten(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['kindergartens'] });
      },
      onError: (error) => {
        console.error('Ошибка при удалении детского сада:', error.message);
      },
    });
    
    const UpdateKindergartenMutation = useMutation<void, Error, { id: string; Update: KindergartenData }>({
      mutationFn: ({ id, Update }) => UpdateKindergarten(id, Update),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['kindergartens'] });
      },
      onError: (error) => {
        console.error('Ошибка при обновлении детского сада', error.message);
      },
    });
    
    return {
      UpdateKindergartenMutation,
      deleteKindergartenMutation,
      addKindergartenMutation,
      kindergartensListMutation,
      isPending: kindergartensListMutation.isPending,
      isError: kindergartensListMutation.isError,
      isSuccess: kindergartensListMutation.isSuccess,
      data: kindergartensListMutation.data,
      error: kindergartensListMutation.error,
    };
  };
 
