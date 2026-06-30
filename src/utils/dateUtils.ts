import { format, parseISO, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, d MMMM yyyy', { locale: es });
};

export const formatShortDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'dd/MM/yyyy');
};

export const formatMonthYear = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMMM yyyy', { locale: es });
};

export const getStartOfWeek = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
};

export const getEndOfWeek = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
};

export const getWeekRange = (startDate: string): string => {
  const start = parseISO(startDate);
  const end = addDays(start, 6);
  return `${format(start, 'dd/MM')} - ${format(end, 'dd/MM/yyyy')}`;
};

export const getCurrentWeekDates = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const startDate = getStartOfWeek(now);
  const endDate = getEndOfWeek(now);
  
  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  };
};

export const getLast12Weeks = (): { startDate: string; endDate: string; label: string }[] => {
  const weeks = [];
  let currentDate = new Date();
  
  for (let i = 0; i < 12; i++) {
    const startDate = getStartOfWeek(currentDate);
    const endDate = getEndOfWeek(currentDate);
    
    weeks.push({
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      label: `${format(startDate, 'dd/MM')} - ${format(endDate, 'dd/MM')}`
    });
    
    // Move to previous week
    currentDate = addDays(startDate, -1);
  }
  
  return weeks;
};