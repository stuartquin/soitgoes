import Immutable from 'immutable';
import { combineReducers } from 'redux';

const getById = (items) => {
  let map = Immutable.OrderedMap();
  items.forEach((item) => {
    if (item.id) {
      map = map.set(item.id, Immutable.fromJS(item));
    }
  });
  return map;
};

export default getById;
