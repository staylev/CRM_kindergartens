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

  export interface EventDataDetails {
    id: string;
    title: string;
    type: string;
    description: string;
    status: string;
    date: Date; // YYYY-MM-DD
    timeStart: Date; // HH:mm
    timeEnd: Date; // HH:mm
    location: string;
    coverImage: string;
    organizer: string;
    groups: string[];
    participants: {
      staff: Array<{
        id: string;
        name: string;
        position: string;
        role: string;
        photo: string;
      }>;
      children: number;
      parents: number;
    };
    schedule: Array<{
      time: string;
      activity: string;
      responsible: string;
    }>;
    resources: Array<{
      category: string;
      items: Array<{
        name: string;
        quantity: number;
        status: string;
      }>;
    }>;
    budget: {
      planned: number;
      spent: number;
      items: Array<{
        name: string;
        amount: number;
        status: string;
      }>;
    };
    photos: Array<{
      id: string;
      url: string;
      description: string;
    }>;
    notes: Array<{
      id: string;
      date: string; // YYYY-MM-DD
      author: string;
      text: string;
    }>;
  }
  