import constants from './constants';
import Immutable from 'immutable';

export default function(state, action) {
  'use strict';
  switch(action.type) {
    case constants.SET_STATE:
      return initialState();
  }

  if (state) {
    return state;
  } else {

    return initialState();
  }
}
