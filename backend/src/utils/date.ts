export const getDayRange = (dateString?: string) => {
  const baseDate = dateString ? new Date(dateString) : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    throw new Error('La fecha proporcionada no es válida');
  }

  const startOfDay = new Date(baseDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);

  return {
    baseDate,
    startOfDay,
    endOfDay,
  };
};

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