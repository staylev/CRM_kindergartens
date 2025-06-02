import { ChildDataDetails } from "../types/children.types";
import { GroupDataDetail } from "../types/Groups..type";
import { KindergartenDetaildata } from "../types/kindergartens.type";

 export const demokindergartenData : KindergartenDetaildata  = {
    id: "1",
    name: "Детский сад 'Солнышко'",
    address: "ул. Образования 123, Город",
    phone: "+7 (555) 123-4567",
    email: "info@solnyshko.ru",
    director: "Анна Иванова",
    foundedYear: 2010,
    capacity: 120,
    currentEnrollment: 98,
    openingHours: "7:00 - 18:00",
    description:
      "Детский сад 'Солнышко' создает благоприятную среду, где дети могут учиться, играть и развиваться. Наша программа ориентирована на раннее развитие детей через творческие занятия, игры на свежем воздухе и образовательные программы.",
    facilities: ["Игровая площадка", "Художественная студия", "Музыкальный зал", "Сад", "Библиотека", "Спортивный зал"],
    programs: [
      { name: "Раннее развитие (2-3 года)", students: 28 },
      { name: "Младшая группа (3-4 года)", students: 32 },
      { name: "Старшая группа (4-5 лет)", students: 38 },
    ],
    staff: [
      { id: 1, name: "Анна Иванова", position: "Директор", photo: "/placeholder.svg?height=100&width=100" },
      {
        id: 2,
        name: "Михаил Смирнов",
        position: "Заместитель директора",
        photo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "Светлана Петрова",
        position: "Старший воспитатель",
        photo: "/placeholder.svg?height=100&width=100",
      },
      { id: 4, name: "Дмитрий Козлов", position: "Воспитатель", photo: "/placeholder.svg?height=100&width=100" },
      { id: 5, name: "Елена Соколова", position: "Воспитатель", photo: "/placeholder.svg?height=100&width=100" },
      { id: 6, name: "Роман Волков", position: "Воспитатель", photo: "/placeholder.svg?height=100&width=100" },
    ],
    events: [
      { id: 1, name: "Родительское собрание", date: "2023-05-15", time: "16:00 - 18:00" },
      { id: 2, name: "Летний фестиваль", date: "2023-06-20", time: "10:00 - 14:00" },
      { id: 3, name: "Выпускной", date: "2023-07-10", time: "11:00 - 13:00" },
    ],
    photos: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
  }

  export const demoGroupsData : GroupDataDetail = {
    id: "G001",
    name: "Солнышко",
    type: "Старшая группа",
    ageRange: "5-6 лет",
    capacity: 25,
    currentEnrollment: 22,
    roomNumber: "203",
    description: "Группа для детей старшего дошкольного возраста с углубленным изучением творческих навыков.",
    schedule: {
      startTime: "08:00",
      endTime: "18:00",
      extendedHours: true,
    },
    staff: [
      {
        id: "T001",
        firstName: "Елена",
        lastName: "Петрова",
        position: "Воспитатель",
        photo: "/placeholder.svg?height=100&width=100",
        education: "Высшее педагогическое",
        experience: "12 лет",
        phone: "+7 (912) 345-67-89",
        email: "petrova@example.com",
      },
      {
        id: "T002",
        firstName: "Ольга",
        lastName: "Иванова",
        position: "Помощник воспитателя",
        photo: "/placeholder.svg?height=100&width=100",
        education: "Среднее специальное",
        experience: "5 лет",
        phone: "+7 (912) 987-65-43",
        email: "ivanova@example.com",
      },
      {
        id: "T003",
        firstName: "Марина",
        lastName: "Сидорова",
        position: "Логопед",
        photo: "/placeholder.svg?height=100&width=100",
        education: "Высшее специальное",
        experience: "8 лет",
        phone: "+7 (912) 111-22-33",
        email: "sidorova@example.com",
        schedule: "Вторник, Четверг 10:00-12:00",
      },
    ],
    children: [
      {
        id: "CH001",
        firstName: "Алексей",
        lastName: "Смирнов",
        age: 5,
        attendance: "Присутствует",
        specialNeeds: false,
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "CH002",
        firstName: "Мария",
        lastName: "Козлова",
        age: 6,
        attendance: "Отсутствует",
        specialNeeds: false,
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "CH003",
        firstName: "Дмитрий",
        lastName: "Новиков",
        age: 5,
        attendance: "Присутствует",
        specialNeeds: true,
        photo: "/placeholder.svg?height=50&width=50",
      },
      // Добавим еще детей для демонстрации
      {
        id: "CH004",
        firstName: "Анна",
        lastName: "Морозова",
        age: 5,
        attendance: "Присутствует",
        specialNeeds: false,
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "CH005",
        firstName: "Игорь",
        lastName: "Соколов",
        age: 6,
        attendance: "Присутствует",
        specialNeeds: false,
        photo: "/placeholder.svg?height=50&width=50",
      },
    ],
    dailySchedule: [
      { time: "08:00 - 08:30", activity: "Прием детей" },
      { time: "08:30 - 09:00", activity: "Утренняя гимнастика" },
      { time: "09:00 - 09:30", activity: "Завтрак" },
      { time: "09:30 - 10:30", activity: "Образовательная деятельность" },
      { time: "10:30 - 12:00", activity: "Прогулка" },
      { time: "12:00 - 12:30", activity: "Обед" },
      { time: "12:30 - 15:00", activity: "Дневной сон" },
      { time: "15:00 - 15:30", activity: "Полдник" },
      { time: "15:30 - 16:30", activity: "Игры, самостоятельная деятельность" },
      { time: "16:30 - 18:00", activity: "Прогулка, уход домой" },
    ],
    weeklySchedule: [
      {
        day: "Понедельник",
        activities: [
          { time: "09:30 - 10:00", name: "Развитие речи" },
          { time: "10:10 - 10:40", name: "Физкультура" },
        ],
      },
      {
        day: "Вторник",
        activities: [
          { time: "09:30 - 10:00", name: "Математика" },
          { time: "10:10 - 10:40", name: "Музыка" },
        ],
      },
      {
        day: "Среда",
        activities: [
          { time: "09:30 - 10:00", name: "Окружающий мир" },
          { time: "10:10 - 10:40", name: "Физкультура" },
        ],
      },
      {
        day: "Четверг",
        activities: [
          { time: "09:30 - 10:00", name: "Рисование" },
          { time: "10:10 - 10:40", name: "Развитие речи" },
        ],
      },
      {
        day: "Пятница",
        activities: [
          { time: "09:30 - 10:00", name: "Лепка/Аппликация" },
          { time: "10:10 - 10:40", name: "Музыка" },
        ],
      },
    ],
    announcements: [
      {
        id: "A001",
        date: "2023-10-15",
        title: "Родительское собрание",
        content: "Уважаемые родители! Приглашаем вас на родительское собрание, которое состоится 20 октября в 18:00.",
        author: "Елена Петрова",
      },
      {
        id: "A002",
        date: "2023-10-10",
        title: "Осенний утренник",
        content:
          "25 октября состоится осенний утренник. Просим подготовить костюмы и выучить стихи согласно розданным материалам.",
        author: "Елена Петрова",
      },
    ],
  }

  export const demoChildData : ChildDataDetails = {
    id: "CH001",
    firstName: "Алексей",
    lastName: "Смирнов",
    dateOfBirth: new Date("2018-05-15"),
    gender: "Мужской",
    group: "Старшая группа",
    enrollmentDate: "2022-09-01",
    photo: "/placeholder.svg?height=150&width=150",
    parents: [
      {
        id: "P001",
        relation: "Мать",
        firstName: "Елена",
        lastName: "Смирнова",
        phone: "+7 (912) 345-67-89",
        email: "elena@example.com",
        address: "ул. Ленина, 42, кв. 15",
      },
      {
        id: "P002",
        relation: "Отец",
        firstName: "Игорь",
        lastName: "Смирнов",
        phone: "+7 (912) 987-65-43",
        email: "igor@example.com",
        address: "ул. Ленина, 42, кв. 15",
      },
    ],
    emergencyContacts: [
      {
        name: "Ольга Петрова",
        relation: "Бабушка",
        phone: "+7 (912) 111-22-33",
      },
    ],
    medicalInfo: {
      bloodType: "A+",
      allergies: ["Орехи", "Пыльца"],
      medications: [],
      specialNeeds: "Нет",
      doctorName: "Иванова А.П.",
      doctorPhone: "+7 (912) 555-44-33",
    },
    attendance: [
      { date: "2023-10-01", status: "Присутствовал", notes: "" },
      { date: "2023-10-02", status: "Присутствовал", notes: "" },
      { date: "2023-10-03", status: "Отсутствовал", notes: "Болезнь" },
      { date: "2023-10-04", status: "Отсутствовал", notes: "Болезнь" },
      { date: "2023-10-05", status: "Присутствовал", notes: "" },
    ],
    notes: [
      {
        date: "2023-09-15",
        author: "Воспитатель Петрова Н.И.",
        text: "Алексей хорошо адаптируется к новой группе.",
      },
      {
        date: "2023-09-28",
        author: "Психолог Сидорова Е.В.",
        text: "Проявляет интерес к творческим занятиям, особенно рисованию.",
      },
    ],
  };
  
  