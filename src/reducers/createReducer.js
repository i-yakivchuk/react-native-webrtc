import * as ActionTypes from '../constants/actions';

/**
 * Function wrapper for create reducer from modules.
 *
 * @param initialState
 * @param handlers
 * @returns {reducer}
 */
export default function createReducer(initialState, handlers) {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action)
		} else if (handlers.hasOwnProperty(ActionTypes.DEFAULT)) {
			return handlers[ActionTypes.DEFAULT](state, action);
		}
		else {
			return state
		}
	}
}
