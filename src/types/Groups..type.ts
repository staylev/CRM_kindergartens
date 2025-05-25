export interface Groups {
  relationships: any;
  type: string;
  attributes: {
    title: string;
    kindergarten_title: string;
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
}

export interface GroupData {
  id: string;
  type: string;
  attributes: GroupAttributes;
}
