
import { Subject, AttendanceStatus } from '../types';

export const getAttendanceStats = (subject: Subject) => {
  let present = 0;
  let absent = 0;
  let od = 0;
  let holiday = 0;

  Object.entries(subject.history).forEach(([dateStr, statuses]) => {
    const date = new Date(dateStr);
    const isSunday = date.getDay() === 0;

    statuses.forEach(status => {
      if (status === 'PRESENT') present++;
      else if (status === 'ABSENT' && !isSunday) absent++;
      else if (status === 'OD') od++;
      else if (status === 'HOLIDAY') holiday++;
    });
  });

  const total = present + absent + od;
  const attended = present + od;
  const percentage = total === 0 ? 0 : (attended / total) * 100;

  return { present, absent, od, holiday, total, attended, percentage };
};

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
};
