import config from '../../config';
import store from '../store/configureStore';
import { getUserToken } from '../selectors/users';
import { Alert } from 'react-native';
import RNFetchBlob from "react-native-fetch-blob";

/**
 * Function for set user auth token
 */
function authorizeRequest(options) {
	options.headers['Authorization'] = getUserToken();
	return options;
}

/**
 * Base request wrapper for set custom option, headers, events.
 */
function base(path, method, customOptions, isMedia = false) {
	
}

/** Base reqeust methods */
const request = {
	get: (path, params) => {
		const pathWithParams = getPathWithQueryString(path, params);
		return base(pathWithParams, 'GET', {});
	},
	delete: (path, params) => {
		const options = {body: JSON.stringify(params)};
		return base(path, 'DELETE', options);
	},
	post: (path, params) => {
		const options = {body: JSON.stringify(params)};
		return base(path, 'POST', options);
	},
	put: (path, params) => {
		const options = {body: JSON.stringify(params)};
		return base(path, 'PUT', options);
	},
	patch: (path, params) => {
		const options = {body: JSON.stringify(params)};
		return base(path, 'PATCH', options);
	}
};

export default request;
