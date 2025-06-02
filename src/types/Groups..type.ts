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
  kindergarten_title: string;
}

export interface GroupData {
  id: string;
  type: string;
  attributes: GroupAttributes;
}

export interface GroupDataDetail {
  id: string;
  name: string;
  type: string;
  ageRange: string;
  capacity: number;
  currentEnrollment: number;
  roomNumber: string;
  description: string;
  schedule: {
    startTime: string;
    endTime: string;
    extendedHours: boolean;
  };
  staff: Array<{
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    photo: string;
    education: string;
    experience: string;
    phone: string;
    email: string;
    schedule?: string;
  }>;
  children: Array<{
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    attendance: "Присутствует" | "Отсутствует";
    specialNeeds: boolean;
    photo: string;
  }>;
  dailySchedule: Array<{
    time: string;
    activity: string;
  }>;
  weeklySchedule: Array<{
    day: string;
    activities: Array<{
      time: string;
      name: string;
    }>;
  }>;
  announcements: Array<{
    id: string;
    date: string;
    title: string;
    content: string;
    author: string;
  }>;
}
