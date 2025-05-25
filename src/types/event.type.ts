export interface events {
    relationships: any;
    type: string;
    attributes: {
      title: string;
      description : string;
      datetime_start: Date;
      datetime_end : Date;
      group_title: string;
      child_last_name: string;
    };
    id: string;
  }
  
  export interface ListEvent {
    included: any;
    meta: {
      count: number;
      totalPages: number;
    };
    data: events[];
  }
  
  export interface EventAttributes {
    title: string;
    description : string;
    datetime_start: Date;
    datetime_end : Date;
    group_id: string;
    child_id: string;
  }
  
  export interface EventData {
    id: string;
    type: string;
    attributes: EventAttributes;
  }
  