import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
	location: null,
	rehydrated: false,
	apiEndpoint: null,
	isInternetAvailable: true,
	slideShowClosed: true,
	encryptPrivateKey: null,
	encryptPublicKey: null,
	encryptMessageToken: null
};


export const app = createReducer(initialState, {
	[ActionTypes.REHYDRATE_COMPLETE](state, action) {
		return Object.assign({}, state, { rehydrated: true })
	},
	[ActionTypes.LOGOUT_SUCCESS](state, action) {
		//preserve rehydration state on logout, so relogin will work
		return Object.assign({}, state, { encryptPrivateKey: null, encryptPublicKey: null, encryptMessageToken: null, rehydrated: true, slideShowClosed: true })
	},
});
