export interface events {
    status: string | number | readonly string[] | undefined;
    notes: any;
    relationships: any;
    type: string;
    attributes: {
      title: string;
      description : string;
      datetime_start: Date;
      datetime_end : Date;
      group_title: string;
      child_last_name: string;
      kinddergarten_id: string;
      kindergarten_title: string;
      type_event: string;
      date:Date
      status: string;
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
    type_event: string;
    date:Date
    kinddergarten_id: string;
    kindergarten_title: string; 
    status: string;
  }
  
  export interface EventData {
    id: string;
    type: string;
    attributes: EventAttributes;
  }

 
  