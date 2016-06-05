import constants from './constants';
import Immutable from 'immutable';

const initialState = () => {
  'use strict';
  return Immutable.Map({
    projects: Immutable.List([]),
    userAuth: null
  });
};

const setProjects = (state, projects) => {
  'use strict';
  return state.set('projects', Immutable.fromJS(projects));
};

export default function(state, action) {
  'use strict';
  if (state) {
    console.log(action, state.toJS());
  }

  switch(action.type) {
    case constants.SET_STATE:
      return initialState();

    case constants.GET_PROJECTS_SUCCESS:
      return setProjects(state, action.projects);
  }

  if (state) {
    return state;
  } else {

    return initialState();
  }
}
