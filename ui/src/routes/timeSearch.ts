export const validateTimeSearch = (search: Record<string, unknown>) => {
  return {
    date: typeof search.date === "string" ? search.date : undefined,
    task: typeof search.task === "string" ? search.task : undefined,
  };
};

export type TimeSearch = ReturnType<typeof validateTimeSearch>;
