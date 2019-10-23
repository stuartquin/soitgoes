import * as api from 'services/api';

export const fetchTimeslips = async (params={}) => api.get('timeslips/', params);

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

export const saveTimeslips = (updatedTimeslips, timeslips) => {
  const newTimeslips = updatedTimeslips.filter(t => !t.id);
  const updated = updatedTimeslips.filter(t => Boolean(t.id));
  const updates = Promise.all(updated.map((timeslip) =>
    api.update('timeslips/', timeslip.id, {
      hours: timeslip.hours,
    })
  ));
  let calls = [updates];

  if (newTimeslips.length) {
    calls = calls.concat(api.add('timeslips/', newTimeslips));
  }

  return Promise.all(calls).then(([results, created=[]]) => {
    const updatedIds = results.map(r => r.id);
    return timeslips.filter(t => !updatedIds.includes(t.id)).concat(
      results
    ).concat(created);
  });
};

