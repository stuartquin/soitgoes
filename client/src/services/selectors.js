export const selectResults = (items, results) => results.map(id => items[id]);

export const getWithJoined = (item, state) => {
  return Object.keys(item).reduce((agg, key) => {
    const related = state[key] && state[key].items ?
      state[key].items :
      state[key] || {};

    return {
      ...agg,
      [key]: related[item[key]] || item[key]
    };
  }, {});
};

export const selectJoined = (items, state) => {
  return Object.keys(items).reduce((agg, key) => ({
    ...agg,
    [key]: getWithJoined(items[key], state)
  }), {});
};

export const selectJoinedResults = (items, state, results) => (
  selectResults(selectJoined(items, state), results)
);

export const selectBy = (items, value, field = 'id') => (
  Object.values(items).filter(item => item[field] === value)
);
