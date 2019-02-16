import keyById from 'services/keyById';

export const constant = (moduleName, name) => {
  return `app/${moduleName}/${name}`;
};

export const fetch = (
  moduleName, fetchFn
) => (...args) => (dispatch) => {
  dispatch({ type: constant(moduleName, 'FETCH') });

  return fetchFn(...args).then((res) => {
    dispatch({
      type: constant(moduleName, 'FETCH_SUCCESS'),
      items: Array.isArray(res.results) ? res.results : [res.results],
    });
  });
};

export const save = (
  moduleName, saveFn
) => (...args) => (dispatch) => {
  dispatch({ type: constant(moduleName, 'SAVE') });

  return saveFn(...args).then((res) => {
    dispatch({
      type: constant(moduleName, 'SAVE_SUCCESS'),
      item: res,
    });

    return res;
  });
};

export const isFetching = (
  moduleName
) => (state = false, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH'):
      return true;
    case constant(moduleName, 'FETCH_SUCCESS'):
      return false;
    default:
      return state;
  }
};

const items = (moduleName) => (state = {}, action) => {
  switch (action.type) {
    case constant(moduleName, 'FETCH_SUCCESS'):
      return keyById(action.items || []);
    case constant(moduleName, 'SAVE_SUCCESS'):
      return {
        ...state,
        [action.item.id]: action.item,
      };
    case constant(moduleName, 'DELETE_SUCCESS'):
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
    case constant(moduleName, 'FETCH_SUCCESS'):
      return action.items.map(item => item.id);
    case constant(moduleName, 'SAVE_SUCCESS'):
      return [action.item.id];
    case constant(moduleName, 'DELETE_SUCCESS'):
      return [action.item.id];
    default:
      return state;
  }
};

export default {
  constant,
  fetch,
  items,
  save,
  isFetching,
  results,
};
