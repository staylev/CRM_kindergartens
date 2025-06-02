export interface Kindergartens {
    type: string;
    attributes: {
      title: string;
      address: string;
    };
    id: string;
}

// Интерфейс ответа от сервера при пполучении списка детских садов
export interface Listkindergartens {
  meta: {
    meta: number;
    totalPages: number;
  };
  data:Kindergartens[];
}

 export interface KindergartenAttributes {
  title: string;
  address: string;
}

export interface KindergartenData {
  id: string;
  type: string;
  attributes: KindergartenAttributes;
}

// types/kindergartens.type.ts
export interface KindergartenDetaildata {
  id: string; // Изменили с number на string, так как ID из URL - строка
  name: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  foundedYear: number;
  capacity: number;
  currentEnrollment: number;
  openingHours: string;
  description: string;
  facilities: string[];
  programs: {
    name: string;
    students: number;
  }[];
  staff: {
    id: number;
    name: string;
    position: string;
    photo: string;
  }[];
  events: {
    id: number;
    name: string;
    date: string;
    time: string;
  }[];
  photos: string[];
}

 
