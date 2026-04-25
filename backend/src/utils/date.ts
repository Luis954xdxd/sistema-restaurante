export function getDayRange(date?: string) {
  const baseDate = date ? new Date(`${date}T00:00:00`) : new Date();

  const startOfDay = new Date(baseDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    baseDate,
    startOfDay,
    endOfDay,
  };
}

export const formatDateForDisplay = (date: Date) => {
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTimeForDisplay = (date: Date) => {
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};