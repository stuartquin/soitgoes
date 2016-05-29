import constants from './constants';
import Immutable from 'immutable';

const initialState = () => {
  return Immutable.Map({
    projects: Immutable.List([]),
    timeslips: Immutable.List([]),
    userAuth: null
  });
};

const setProjects = (state, projects) => {
  return state.set('projects', Immutable.fromJS(projects));
};

const setTimeslips = (state, timeslips) => {
  return state.set('timeslips', Immutable.fromJS(timeslips));
};

const setUserAuth = (state, auth) => {
  return state.set('userAuth', auth);
};

const updateProjectTimeslip = (state, action) => {
  const project = action.project;
  const date = action.date;
  const index = state.get('timeslips').findIndex((t) => {
    return t.get('project') === project.get('id') && t.get('date') === date;
  });

  if (index === -1) {
    return state.updateIn(['timeslips'], (timeslips) => {
      return timeslips.push(Immutable.Map({
        project: action.project.get('id'),
        hours: action.hours,
        date: action.date,
        isNew: true,
        user: 1 // @TODO this should be the real user
      }));
    });
  } else {
    return state.updateIn(['timeslips'], (timeslips) => {
      return timeslips.update(index, (timeslip) => {
        return timeslip.set('hours', action.hours);
      });
    });
  }
  return state;
}

export default function(state, action) {
  if (state) {
    console.log(action, state.toJS());
  }

  switch(action.type) {
    case constants.SET_STATE:
      return initialState();

    case constants.GET_PROJECTS_SUCCESS:
      return setProjects(state, action.projects);

    case constants.GET_TIMESLIPS_SUCCESS:
      return setTimeslips(state, action.timeslips);

    case constants.GET_USER_AUTH_SUCCESS:
      return setUserAuth(state, action.auth);

    case constants.GET_USER_AUTH_ERROR:
      return setUserAuth(state, null);

    case constants.SET_USER_AUTH_SUCCESS:
      return setUserAuth(state, action.auth);

    case constants.UPDATE_PROJECT_TIMESLIPS:
      return updateProjectTimeslip(state, action);
  }

  if (state) {
    return state;
  } else {
    return initialState();
  }
}
