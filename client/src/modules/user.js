import { combineReducers } from 'redux';

import * as api from 'services/api';
import reduxHelper from 'services/reduxHelper';

const NS = 'USER';

export const fetchUser = reduxHelper.fetchOne(NS, () => api.get('user/'));

const items = reduxHelper.items(NS);
const results = reduxHelper.results(NS);

export default combineReducers({
  items,
  results,
});
