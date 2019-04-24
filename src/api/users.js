/**
 * Created by ivan on 15.03.18.
 */
import request from './request';
import R from 'ramda';

/**
 * Function for get user data.
 */
export function getUser(email) {
	return request.get('user');
}

/**
 * Function for update user data.
 */
export function update(params) {
	return request.post('user', params);
}

/**
 * Function for auth user to app.
 */
export function login(email, password) {
	const params = { email, password };
	return request.post('user/auth', params);
}

/**
 * Function for auth user as 2fa to app.
 */
export function login2fa(sessionkey) {
	const params = { sessionkey };
	return request.post('user/request_2fa', params);
}

/**
 * Function for logout user from app.
 */
export function logout(deviceId) {
	const params = { deviceId };
	return request.post('user/logout', params);
}
