/**
 * Created by ivan on 16.03.18.
 */
import { combineReducers } from 'redux';
import { users } from './users';
import { contacts } from './contacts';
import { conversations } from './conversations';


export const entities = combineReducers({
	users,
	contacts,
	conversations
});
