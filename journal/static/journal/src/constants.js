const values = [
  'SET_STATE',

  'GET_USER_AUTH',
  'GET_USER_AUTH_ERROR',
  'GET_USER_AUTH_SUCCESS',

  'GET_PROJECTS_START',
  'GET_PROJECTS_ERROR',
  'GET_PROJECTS_SUCCESS',

  'GET_TIMESLIPS_START',
  'GET_TIMESLIPS_ERROR',
  'GET_TIMESLIPS_SUCCESS'
];

const constants = {}
values.forEach(val => constants[val] = val);
export default constants;
