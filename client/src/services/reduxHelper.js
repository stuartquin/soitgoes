import keyById from 'services/keyById';

export const constant = (moduleName, name, stage='') => (
  stage ? `app.${moduleName}.${name}.${stage}` : `app.${moduleName}.${name}`
);

export const fetch = (
  moduleName, fetchFn
) => (...args) => (dispatch) => {
  dispatch({type: constant(moduleName, 'FETCH', 'start')});

  return fetchFn(...args).then((res) => {
    const results = res.results || res;
    dispatch({
      type: constant(moduleName, 'FETCH', 'success'),
      items: Array.isArray(results) ? results : [results],
    });
  });
};

export const fetchOne = (
  moduleName, fetchFn
) => (...args) => (dispatch) => {
  dispatch({type: constant(moduleName, 'FETCHONE', 'start')});

  return fetchFn(...args).then((res) => {
    dispatch({
      type: constant(moduleName, 'FETCHONE', 'success'),
      items: [res],
    });
    return res;
  });
};

export const save = (
  moduleName, saveFn
) => (...args) => (dispatch) => {
  dispatch({type: constant(moduleName, 'SAVE', 'start')});

  return saveFn(...args).then((res) => {
    dispatch({
      type: constant(moduleName, 'SAVE', 'success'),
      items: [res],
    });

    return res;
  });
};

export const isFetching = (
  moduleName
) => (state = false, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH', 'start'):
    case constant(moduleName, 'FETCHONE', 'start'):
      return true;
    case constant(moduleName, 'FETCHONE', 'success'):
      return false;
    default:
      return state;
  }
};

const items = (moduleName) => (state = {}, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH', 'success'):
    case constant(moduleName, 'FETCHONE', 'success'):
    case constant(moduleName, 'SAVE', 'success'):
      return {
        ...state,
        ...keyById(action.items || [])
      };
    case constant(moduleName, 'DELETE', 'success'):
      return Object.keys(state).filter(
        key => key !== action.item.id
      ).reduce((filtered, key) => {
        return {
          ...filtered,
          [state[key].id]: state[key],
        };
      }, {});
    default:
      return state;
  }
};

const results = (moduleName) => (state = [], action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH', 'success'):
      return action.items.map(item => item.id);
    case constant(moduleName, 'SAVE', 'success'):
      return action.items.map(item => item.id).concat(state);
    case constant(moduleName, 'DELETE', 'success'):
      return [action.item.id];
    default:
      return state;
  }
};

export default {
  constant,
  fetch,
  fetchOne,
  items,
  save,
  isFetching,
  results,
};
