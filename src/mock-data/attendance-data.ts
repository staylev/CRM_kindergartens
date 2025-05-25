import { addDays, format, subMonths } from 'date-fns';

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface ChildAttendance {
  id: string;
  name: string;
  avatar: string;
  attendance: Record<string, AttendanceStatus>;
}

export interface AttendanceData {
  children: ChildAttendance[];
  dates: string[];
}

// Helper function to generate a random attendance status
const getRandomStatus = (): AttendanceStatus => {
  const random = Math.random();
  if (random > 0.85) return 'absent';
  if (random > 0.75) return 'late';
  return 'present';
};

// Helper function to generate random attendance data for a child
const generateChildAttendance = (
  id: string,
  name: string,
  avatar: string,
  dates: string[]
): ChildAttendance => {
  const attendance: Record<string, AttendanceStatus> = {};
  
  dates.forEach(date => {
    // Don't generate attendance for weekends
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      attendance[date] = 'absent';
    } else {
      attendance[date] = getRandomStatus();
    }
  });
  
  return {
    id,
    name,
    avatar,
    attendance,
  };
};

// Generate dates for the last X months (default: 6 months)
export const generateDates = (numMonths = 6): string[] => {
  const endDate = new Date();
  const startDate = subMonths(endDate, numMonths);
  
  const dates: string[] = [];
  let currentDate = startDate;
  
  while (currentDate <= endDate) {
    dates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

// Generate mock data
export const generateMockData = (): AttendanceData => {
  const dates = generateDates();
  
  const children: ChildAttendance[] = [
    generateChildAttendance('1', 'Александр К.', '/placeholder.svg', dates),
    generateChildAttendance('2', 'София В.', '/placeholder.svg', dates),
    generateChildAttendance('3', 'Михаил П.', '/placeholder.svg', dates),
    generateChildAttendance('4', 'Анна Д.', '/placeholder.svg', dates),
    generateChildAttendance('5', 'Дмитрий С.', '/placeholder.svg', dates),
    generateChildAttendance('6', 'Екатерина М.', '/placeholder.svg', dates),
    generateChildAttendance('7', 'Иван Т.', '/placeholder.svg', dates),
    generateChildAttendance('8', 'Мария Г.', '/placeholder.svg', dates),
    generateChildAttendance('9', 'Никита В.', '/placeholder.svg', dates),
    generateChildAttendance('10', 'Ольга К.', '/placeholder.svg', dates),
  ];
  
  return {
    children,
    dates,
  };
};

// Calculate attendance statistics
export const calculateStats = (data: AttendanceData) => {
  const stats = {
    totalChildren: data.children.length,
    byDate: {} as Record<string, { present: number; absent: number; late: number; total: number }>,
    overall: { present: 0, absent: 0, late: 0, total: 0 },
  };
  
  data.dates.forEach(date => {
    stats.byDate[date] = { present: 0, absent: 0, late: 0, total: 0 };
    
    data.children.forEach(child => {
      const status = child.attendance[date];
      if (status) {
        stats.byDate[date][status]++;
        stats.byDate[date].total++;
        stats.overall[status]++;
        stats.overall.total++;
      }
    });
  });
  
  return stats;
};

export const getMockData = (): AttendanceData => {
  return generateMockData();
};
