// Esse reducer será responsável por tratar as informações da pessoa usuária
import { USER_LOGIN } from '../actions/index';

const INITIAL_STATE = {

  email: '', // string que armazena o email da pessoa usuária

};

function user(state = INITIAL_STATE, action) {
  switch (action.type) {
  case USER_LOGIN:
    return {
      ...state,
      email: action.payload,
    };
  default:
    return state;
  }
}

export default user;
