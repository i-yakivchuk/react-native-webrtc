/**
 * Created by ivan on 15.03.18.
 */
import {
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	LOGOUT_SUCCESS,
	LOGOUT_ERROR,
	REFRESH_USER_SUCCESS,
	REFRESH_USER_REQUEST,
	SIGNUP_SUCCESS,
	SIGNUP_ERROR,
} from '../constants/actions';

import { normalize } from 'normalizr';
import { usersSchema } from '../normalizr';
import * as users from '../api/users';
import { getCurrent } from '../selectors/users';
import { contactsNormalize } from './contacts';
import WebSocketProvider from '../api/webSocket';
import {AppState} from "react-native";
const apiEndpoint = config.api.endpoint;

// base simple action
export const loginSuccess = (payload) => ({ type: LOGIN_SUCCESS, payload: payload });
export const loginError = user => ({ type: LOGIN_ERROR });

/**
 * Auth user action.
 *
 * @param email
 * @param password
 */
export const login = (email, password) => (dispatch) => {
	dispatch({ type: LOGIN_REQUEST });

	users.login(email, password).then(res => {
		if (res.sessionkey) {
			dispatch(required2fa(res.sessionkey));
		} else {
			if (res.contacts)
				contactsNormalize(res.contacts, dispatch);

			const userNorm = normalize(res, usersSchema);
			const loginPayload = Object.assign(userNorm, { apiEndpoint });
			dispatch(loginSuccess(loginPayload));
		}
	}).catch(e => {
		dispatch(loginError());
	});
};
