export interface Groups {
  relationships: any;
  type: string;
  attributes: {
    title: string;
    kindergarten_title: string;
    description: string;
    type_group: string;
    count_children: number;
    number_classroom: number;  
  };
  id: string;
}

export interface ListGroups {
  included: any;
  meta: {
    count: number;
    totalPages: number;
  };
  data: Groups[];
}

export interface GroupAttributes {
  title: string;
  kindergarten_title: string;
  description: string;
  type_group: string;
  count_children: number;
  number_classroom: number;
  
}

export interface GroupData {
  id: string;
  type: string;
  attributes: GroupAttributes;
}

 
