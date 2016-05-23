'use strict';
import constants from '../constants';

export const updateProjectTimeslip = (project, date, hours) => {
  return {
    type: constants.UPDATE_PROJECT_TIMESLIPS,
    project,
    hours,
    date
  };
};

