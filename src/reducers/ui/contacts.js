import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';
import R from 'ramda';


const initialState = {

};


export const contacts = createReducer(initialState, {
	[ActionTypes.GET_USER_CONTACTS_SUCCESS](state, action) {
		const list = action.payload.isUpdate ? R.uniq(action.payload.result) : R.uniq([...state.list, ...action.payload.result]);
		return Object.assign({}, state, { searchLoading: false, refreshing: false, list: list, search: null })
	},
	[ActionTypes.GET_USER_CONTACTS_REQUEST](state, action) {
		return Object.assign({}, state, { refreshing: false, selected: null })
	},
	[ActionTypes.GET_USER_CONTACTS_ERROR](state, action) {
		return Object.assign({}, state, { loading: false, refreshing: false, selected: null })
	},
	[ActionTypes.SELECT_CONTACT](state, action) {
		return Object.assign({}, state, { refreshing: false, selected: action.payload, addContact: null })
	},
	[ActionTypes.GET_USER_CONTACTS_SHOW_LOADER](state, action) {
		return Object.assign({}, state, { refreshing: false, loading: false })
	},
	[ActionTypes.REFRESH_MY_CONTACTS](state, action) {
		return Object.assign({}, state, { refreshing: true, loading: false })
	},
	[ActionTypes.ADD_NEW_CONTACT](state, action) {
		return Object.assign({}, state, { selected: null, addContact: {...action.payload, ...{ isNewContact: true }}})
	},
	[ActionTypes.ADD_NEW_CONTACT_SUCCESS](state, action) {
		return Object.assign({}, state, { searchLoading: true, selected: null, addContact: null, search: null })
	},
	[ActionTypes.SEARCH_CONTACT_SUCCESS](state, action) {
		return Object.assign({}, state, { addContact: null, selected: null, searchLoading: false, search: R.uniq(action.payload) })
	},
	[ActionTypes.SEARCH_CONTACT_REQUEST](state, action) {
		return Object.assign({}, state, { addContact: null, selected: null, searchLoading: true, search: [] })
	},
	[ActionTypes.SEARCH_CONTACT_ERROR](state, action) {
		return Object.assign({}, state, { addContact: null, selected: null, searchLoading: false, search: [] })
	}
});
