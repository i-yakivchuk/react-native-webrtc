import { combineReducers } from 'redux';
import { app } from './app';
import { contacts } from './contacts';
import { call } from './call';
import { callLog } from './call-log';
import { chat } from './chat';


export const ui = combineReducers({
  app,
	call,
	contacts,
	callLog,
	chat,
	stickers,
	files
});
