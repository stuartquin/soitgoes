export const getTotal = (timeslips) => {
  return timeslips.reduce((total, t) => {
    return total + (t.hours * t.project.hourly_rate);
  }, 0);
};

export const groupByProject = (timeslips) => {
  return timeslips.reduce((agg, timeslip) => {
    const {project} = timeslip;
    const existing = agg[project.id] || [];

    return {
      ...agg,
      [project.id]: existing.concat([timeslip]),
    }
  }, {});
};
