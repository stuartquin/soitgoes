export const selectResults = (items, results) => results.map(id => items[id]);

const getWithJoined = (item, state) => {
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
  console.log('selectJoined', items, state);

  return Object.keys(items).reduce((agg, key) => ({
    ...agg,
    [key]: getWithJoined(items[key], state)
  }), {});
};
