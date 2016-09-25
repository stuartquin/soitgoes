const values = [
  'SET_STATE',

  'CREATE_SESSION_SUCCESS',

  'GET_USER_START',
  'GET_USER_ERROR',
  'GET_USER_SUCCESS',

  'GET_VERSION_SUCCESS',

  'GET_ACTIVITY_FEED_START',
  'GET_ACTIVITY_FEED_ERROR',
  'GET_ACTIVITY_FEED_SUCCESS',

  'GET_PROJECTS_START',
  'GET_PROJECTS_ERROR',
  'GET_PROJECTS_SUCCESS',

  'GET_TIMESLIPS_START',
  'GET_TIMESLIPS_ERROR',
  'GET_TIMESLIPS_SUCCESS',

  'UPDATE_PROJECT_TIMESLIP',
  'ADD_PROJECT_TIMESLIP',

  'SAVE_TIMESLIPS_START',
  'SAVE_TIMESLIPS_ERROR',
  'SAVE_TIMESLIPS_SUCCESS',

  'SET_TIMESLIP_ACTIVE_DATE',

  'GET_INVOICES_SUCCESS',

  'CREATE_INVOICE',
  'CREATE_INVOICE_SUCCESS',

  'GET_INVOICE_SUCCESS',
  'GET_INVOICE_TIMESLIPS_SUCCESS',

  'GET_INVOICE_ITEMS_SUCCESS',
  'CREATE_INVOICE_ITEM_SUCCESS',

  'CLEAR_INVOICE_TIMESLIPS',
  'DELETE_INVOICE_SUCCESS',
  'SAVE_INVOICE_SUCCESS'
];

const constants = {};
values.forEach(val => constants[val] = val);
export default constants;
