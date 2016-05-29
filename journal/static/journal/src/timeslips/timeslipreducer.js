import constants from '../constants';
import Immutable from 'immutable';

const setTimeslips = (state, timeslips) => {
  return state.set('items', Immutable.fromJS(timeslips));
};

const updateProjectTimeslip = (state, action) => {
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
        return timeslip.set('hours', action.hours);
      });
    });
  }
  return state;
}

export default function(state, action) {
  switch(action.type) {
    case constants.GET_TIMESLIPS_SUCCESS:
      return setTimeslips(state, action.timeslips);

    case constants.UPDATE_PROJECT_TIMESLIPS:
      return updateProjectTimeslip(state, action);
  }

  return state || Immutable.Map({
    items: Immutable.List([])
  });
}
