export const GET_TIMESLIP_START = 'GET_TIMESLIP_START';
export const GET_TIMESLIP_ERROR = 'GET_TIMESLIP_ERROR';
export const GET_TIMESLIP_SUCCESS = 'GET_TIMESLIP_SUCCESS';

const baseUrl = 'http://localhost:8000/api/';

const getOptions = (method) => {
  return {
      method: 'get',
      headers: {
        Authorization: 'Basic '+btoa('stuart:topsecret'),
        'Content-Type': 'application/json'
      }
  };
};

const getTimeslipsSuccess = (timeslips, dispatch) => {
    return {
        type: GET_TIMESLIP_SUCCESS,
        timeslips
    };
};

const getTimeslipsError = (error, dispatch) => {
    return {
        type: GET_TIMESLIP_ERROR,
        error
    };
};

export const getTimeslips = (projectId) => {
    const url = baseUrl + `projects/${projectId}/timeslips?format=json`;
    return (dispatch) => {
        return fetch(url, getOptions('get')).then(
            res => {
                return res.json().then(json => {
                    return dispatch(getTimeslipsSuccess(json, dispatch));
                });
            },
            error => dispatch(getTimeslipsError(error, dispatch))
        );
    };
};
