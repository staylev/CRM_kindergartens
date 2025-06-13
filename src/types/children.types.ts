export interface children {
  relationships: any;
  type: string;
  attributes: {
    first_name: string;
    last_name: string;
    patronymic: string;
    date_of_birth: Date;
    group_title: string;
    kindergarten_title: string;
  };
  id: string;
}

export interface ListChild {
  included: any;
  meta: {
    count: number;
    totalPages: number;
  };
  data: children[];
}

export interface ChildAttributes {
    first_name: string;
    last_name: string;
    patronymic: string;
    date_of_birth: Date;
    group_title: string;
    gender: string;
    image: string;
    kindergarten_title: string;

}

export interface ChildData {
  id: string;
  type: string;
  attributes: ChildAttributes;
}

export interface ChildNotes {
  id: string;
  type: string;
  attributes: {
    note: string;
    date: Date;
  };
   
}
 