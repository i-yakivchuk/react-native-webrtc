import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';
import R from 'ramda';


const initialState = {
	loading: false,
	refreshing: false,
	selected: null,
	page: 1,
	allLoaded: false,
	list: []
};


export const callLog = createReducer(initialState, {
	[ActionTypes.GET_CALL_LOG_SUCCESS](state, action) {
		const newList = action.payload.page === 1 ? action.payload.result : R.uniq([...state.list, ...action.payload.result]);
		const allLoaded = action.payload.page >= action.payload.pages;
		return Object.assign({}, state, { allLoaded: allLoaded, loading: false, refreshing: false, selected: null, list: newList, page: allLoaded ? state.page : action.payload.page })
	},
	[ActionTypes.GET_CALL_LOG_REQUEST](state, action) {
		return Object.assign({}, state, { selected: null })
	},
	[ActionTypes.GET_CALL_LOG_ERROR](state, action) {
		return Object.assign({}, state, { refreshing: false, loading: false, selected: null })
	},
	[ActionTypes.GET_CALL_LOG_SHOW_LOADER](state, action) {
		return Object.assign({}, state, { loading: action.payload })
	},
	[ActionTypes.REFRESH_CALL_HISTORY](state, action) {
		return Object.assign({}, state, { loading: false, refreshing: true, page: 1 })
	}
});
