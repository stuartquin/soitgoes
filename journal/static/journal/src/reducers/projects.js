'use strict';
import Immutable from 'immutable';

import constants from '../constants';

const initialState = () => {
  return Immutable.Map({
    items: Immutable.List([]),
    view: Immutable.Map({})
  });
};

const setProjects = (state, projects) => {
  return state.set('items', Immutable.fromJS(projects));
};

export default function(state, action) {
  switch(action.type) {
    case constants.GET_PROJECTS_SUCCESS:
      return setProjects(state, action.projects);
  }

  if (state) {
    return state;
  } else {
    return initialState();
  }
}
