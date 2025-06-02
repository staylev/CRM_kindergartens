import { ChildDataDetails } from "../types/children.types";
import { EventDataDetails } from "../types/event.type";
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
  

  // Пример данных о событии
 export const demoEventData: EventDataDetails = {
  id: "E001",
  title: "Осенний утренник",
  type: "Праздник",
  description:
    "Традиционный осенний утренник с участием детей старшей и подготовительной групп. Праздник включает в себя театрализованное представление, песни, танцы и игры на осеннюю тематику.",
  status: "Запланировано",
  date: "2023-10-25",
  timeStart: "10:00",
  timeEnd: "11:30",
  location: "Музыкальный зал",
  coverImage: "/placeholder.svg?height=300&width=600",
  organizer: "Петрова Елена Ивановна",
  groups: ["Старшая группа 'Солнышко'", "Подготовительная группа 'Звездочки'"],
  participants: {
    staff: [
      {
        id: "T001",
        name: "Петрова Елена Ивановна",
        position: "Музыкальный руководитель",
        role: "Организатор",
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "T002",
        name: "Иванова Ольга Петровна",
        position: "Воспитатель",
        role: "Ведущая",
        photo: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "T003",
        name: "Сидорова Марина Александровна",
        position: "Воспитатель",
        role: "Помощник",
        photo: "/placeholder.svg?height=50&width=50",
      },
    ],
    children: 45,
    parents: 30,
  },
  schedule: [
    {
      time: "09:30 - 10:00",
      activity: "Подготовка зала, проверка оборудования",
      responsible: "Петрова Е.И., Сидорова М.А.",
    },
    {
      time: "10:00 - 10:10",
      activity: "Вступительное слово, приветствие гостей",
      responsible: "Иванова О.П.",
    },
    {
      time: "10:10 - 10:40",
      activity: "Театрализованное представление 'Осенняя сказка'",
      responsible: "Петрова Е.И., дети старшей группы",
    },
    {
      time: "10:40 - 11:00",
      activity: "Песни и танцы на осеннюю тематику",
      responsible: "Дети подготовительной группы",
    },
    {
      time: "11:00 - 11:20",
      activity: "Игры и конкурсы с родителями",
      responsible: "Иванова О.П., Сидорова М.А.",
    },
    {
      time: "11:20 - 11:30",
      activity: "Заключительное слово, вручение подарков",
      responsible: "Иванова О.П.",
    },
  ],
  resources: [
    {
      category: "Оборудование",
      items: [
        { name: "Музыкальный центр", quantity: 1, status: "Подтверждено" },
        { name: "Микрофоны", quantity: 2, status: "Подтверждено" },
        { name: "Проектор", quantity: 1, status: "Требуется проверка" },
      ],
    },
    {
      category: "Декорации",
      items: [
        { name: "Осенние листья (комплект)", quantity: 3, status: "Подтверждено" },
        { name: "Фигуры овощей и фруктов", quantity: 10, status: "В процессе подготовки" },
        { name: "Баннер 'Осенний праздник'", quantity: 1, status: "Подтверждено" },
      ],
    },
    {
      category: "Костюмы",
      items: [
        { name: "Костюм Осени", quantity: 1, status: "Подтверждено" },
        { name: "Костюмы овощей", quantity: 6, status: "В процессе подготовки" },
        { name: "Костюмы животных", quantity: 4, status: "Требуется проверка" },
      ],
    },
  ],
  budget: {
    planned: 15000,
    spent: 8500,
    items: [
      { name: "Материалы для декораций", amount: 3500, status: "Оплачено" },
      { name: "Ткани для костюмов", amount: 5000, status: "Оплачено" },
      { name: "Подарки детям", amount: 6500, status: "Запланировано" },
    ],
  },
  photos: [
    { id: "P001", url: "/placeholder.svg?height=200&width=300", description: "Репетиция танца" },
    { id: "P002", url: "/placeholder.svg?height=200&width=300", description: "Подготовка декораций" },
    { id: "P003", url: "/placeholder.svg?height=200&width=300", description: "Примерка костюмов" },
  ],
  notes: [
    {
      id: "N001",
      date: "2023-10-01",
      author: "Петрова Е.И.",
      text: "Репетиции идут по плану. Дети хорошо запоминают слова песен и движения танцев.",
    },
    {
      id: "N002",
      date: "2023-10-05",
      author: "Иванова О.П.",
      text: "Необходимо уточнить количество родителей, которые будут присутствовать на мероприятии.",
    },
    {
      id: "N003",
      date: "2023-10-10",
      author: "Сидорова М.А.",
      text: "Костюмы почти готовы, осталось доделать несколько элементов для костюмов овощей.",
    },
  ],
}
  