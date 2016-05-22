import constants from './constants';
import Immutable from 'immutable';

const initialState = () => {
  return Immutable.Map({
    projects: Immutable.List([]),
    timeslips: Immutable.List([])
  });
};

const setProjects = (state, projects) => {
  return state.set('projects', Immutable.fromJS(projects));
};

const setTimeslips = (state, timeslips) => {
  return state.set('timeslips', Immutable.fromJS(timeslips));
};

export default function(state, action) {
  switch(action.type) {
    case constants.SET_STATE:
      return initialState();

    case constants.GET_PROJECTS_SUCCESS:
      return setProjects(state, action.projects);

    case constants.GET_TIMESLIPS_SUCCESS:
      return setTimeslips(state, action.timeslips);
  }
}
