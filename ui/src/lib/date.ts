import {
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const getDate = (date: Date | string | undefined | null) => {
  if (!date) {
    return new Date();
  }
  return date instanceof Date ? date : new Date(date);
};

export const getStartOfWeek = (date: Date | string | undefined) => {
  return startOfWeek(getDate(date), { weekStartsOn: 1 });
};

export const getEndOfWeek = (date: Date | string | undefined) => {
  return endOfWeek(getDate(date), { weekStartsOn: 1 });
};

export const getStartOfMonth = (date: Date | string | undefined) => {
  return startOfMonth(getDate(date));
};

export const getEndOfMonth = (date: Date | string | undefined) => {
  return endOfMonth(getDate(date));
};

export const formatQuery = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const getTimeSlipQueryRange = (
  date: Date | string | undefined
): [string, string] => {
  const startDate = addWeeks(getStartOfWeek(date), -1);
  return [formatQuery(startDate), formatQuery(addWeeks(getEndOfWeek(date), 1))];
};
