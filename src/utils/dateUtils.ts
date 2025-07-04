import { format, formatDistanceToNow, isAfter, isBefore, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

export const formatRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ptBR });
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const isDateInRange = (date: Date, start: Date, end: Date) => {
  return (isAfter(date, start) || date.getTime() === start.getTime()) &&
         (isBefore(date, end) || date.getTime() === end.getTime());
};

export const getMonthName = (date: Date) => {
  return format(date, 'MMMM yyyy', { locale: ptBR });
};

export const getMonthsBetween = (startDate: Date, endDate: Date) => {
  const months = [];
  const start = startOfMonth(startDate);
  const end = endOfMonth(endDate);
  
  let current = start;
  while (isBefore(current, end) || current.getTime() === end.getTime()) {
    months.push(new Date(current));
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }
  
  return months;
};