const keyById = (items) => {
  return items.reduce((agg, item) => ({
    ...agg,
    [item.id]: item,
  }), {});
};

export default keyById;
