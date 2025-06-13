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
  founded_by : string;
  сapacity : number;
  director : string;
  phone : string;
  email : string;
  description : string;
  photos : string[];
  time_working : string;
}

export interface KindergartenData {
  id: string;
  type: string;
  attributes: KindergartenAttributes;
}

 
 

 
