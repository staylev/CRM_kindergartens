export interface children {
  relationships: any;
  type: string;
  attributes: {
    first_name: string;
    last_name: string;
    patronymic: string;
    date_of_birth: Date;
    group_title: string;
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
    group_id: string;
}

export interface ChildData {
  id: string;
  type: string;
  attributes: ChildAttributes;
}

export interface ChildDataDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  group: string;
  enrollmentDate: string;
  photo: string;
  parents: {
    id: string;
    relation: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
  }[];
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
  medicalInfo: {
    bloodType: string;
    allergies: string[];
    medications: string[];
    specialNeeds: string;
    doctorName: string;
    doctorPhone: string;
  };
  attendance: {
    date: string;
    status: string;
    notes: string;
  }[];
  notes: {
    date: string;
    author: string;
    text: string;
  }[];
}
