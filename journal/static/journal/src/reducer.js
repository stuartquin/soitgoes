import constants from './constants';
import Immutable from 'immutable';

const initialState = () => {
  return Immutable.Map({
    projects: Immutable.List([]),
    userAuth: null
  });
};

const setProjects = (state, projects) => {
  return state.set('projects', Immutable.fromJS(projects));
};

const setUserAuth = (state, auth) => {
  return state.set('userAuth', auth);
};

export default function(state, action) {
  if (state) {
    console.log(action, state.toJS());
  }

  switch(action.type) {
    case constants.SET_STATE:
      return initialState();

    case constants.GET_PROJECTS_SUCCESS:
      return setProjects(state, action.projects);

    case constants.GET_USER_AUTH_SUCCESS:
      return setUserAuth(state, action.auth);

    case constants.GET_USER_AUTH_ERROR:
      return setUserAuth(state, null);

    case constants.SET_USER_AUTH_SUCCESS:
      return setUserAuth(state, action.auth);
  }

  if (state) {
    return state;
  } else {
    return initialState();
  }
}
