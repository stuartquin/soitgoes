import Immutable from 'immutable';
import moment from 'moment';

import constants from '../constants';

const setTimeslips = (state, timeslips) => {
  'use strict';
  return state.set('items', Immutable.fromJS(timeslips));
};

const updateProjectTimeslip = (state, action) => {
  'use strict';
  const project = action.project;
  const date = action.date;
  const index = state.get('items').findIndex((t) => {
    return t.get('project') === project.get('id') && t.get('date') === date;
  });

  if (index === -1) {
    return state.updateIn(['items'], (timeslips) => {
      return timeslips.push(Immutable.Map({
        project: action.project.get('id'),
        hours: action.hours,
        date: action.date,
        isNew: true,
        user: 1 // @TODO this should be the real user
      }));
    });
  } else {
    return state.updateIn(['items'], (timeslips) => {
      return timeslips.update(index, (timeslip) => {
        return timeslip.set('hours', action.hours).set('isUpdated', true);
      });
    });
  }
  return state;
};

const setActiveDate = (state, date) => {
  'use strict';
  return state.setIn(['view', 'activeDate'], date);
};

const initialState = () => {
  'use strict';
  return Immutable.Map({
    items: Immutable.List([]),
    view: Immutable.Map({
      activeDate: moment().startOf('isoweek').isoWeekday(1)
    })
  });
};

export default function(state, action) {
  'use strict';
  switch(action.type) {
    case constants.GET_TIMESLIPS_SUCCESS:
      return setTimeslips(state, action.timeslips);

    case constants.UPDATE_PROJECT_TIMESLIPS:
      return updateProjectTimeslip(state, action);

    case constants.SET_TIMESLIP_ACTIVE_DATE:
      return setActiveDate(state, action.date);
  }
  return state || initialState();
}
