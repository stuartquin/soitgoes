export const getHourlyTotal = (timeslips, projects) => {
  return timeslips.reduce((total, t) => {
    const project = projects[t.project] || {hourly_rate: 0};
    return total + project.hourly_rate;
  }, 0);
};
