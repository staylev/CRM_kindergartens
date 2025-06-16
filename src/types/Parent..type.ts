export interface Parents {
    relationships: any;
    type: string;
    attributes: {
      tg: string;
      frist_name: string;
      last_name: string;
      patronymic: string;
      number_phone: string;
      email: string;
      date_of_birth: Date;
      pasport_series: string;
      type_of_parent: string;
      adress: string;
      place_of_work : string;
      post: string;
      children_ids: string[];
    };
    id: string;
  }
  
  export interface ListParents {
    included: any;
    meta: {
      count: number;
      totalPages: number;
    };
    data: Parents[];
  }
  
  export interface ParentsAttributes {
    id: string;
    tg: string;
    frist_name: string;
    last_name: string;
    patronymic: string;
    number_phone: string;
    email: string;
    date_of_birth: Date;
    pasport_series: string;
    type_of_parent: string;
    adress: string;
    place_of_work : string;
    post: string;
    children_ids : string[];
  }
  
  export interface ParentData {
    id: string;
    type: string;
    attributes: ParentsAttributes;
  }
  
  export interface ChildNotes {
    id: string;
    type: string;
    attributes: {
      note: string;
      date: Date;
    };
  }
   