import Immutable from 'immutable';
import { combineReducers } from 'redux';

const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE';
const CLEAR_FLASH_MESSAGE = 'CLEAR_FLASH_MESSAGE';


export const addFlashMessage = (message) => {
  return {
    type: ADD_FLASH_MESSAGE,
    message
  };
};

export const clearFlashMessage = () => {
  return { type: CLEAR_FLASH_MESSAGE };
};

const flashMessage = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case ADD_FLASH_MESSAGE:
    return Immutable.Map(action.message);
  case CLEAR_FLASH_MESSAGE:
    return Immutable.Map();
  default:
    return state;
  }
};

export default flashMessage;
