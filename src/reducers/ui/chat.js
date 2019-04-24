/**
 * Created by ivan on 11.06.18.
 */
import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';
import R from 'ramda';


const initialState = {

};


export const chat = createReducer(initialState, {
	[ActionTypes.CHAT_SELECT_CONVERSATION](state, action) {
		return Object.assign({}, state, { messages: [], page: 1, selectedConversation: action.payload})
	},
	[ActionTypes.CHAT_GET_RECIPIENT_CONVERSATION_REQUEST](state, action) {
		return Object.assign({}, state, { loading: true, error: false })
	},
	[ActionTypes.CHAT_GET_RECIPIENT_CONVERSATION_ERROR](state, action) {
		return Object.assign({}, state, { loading: false, error: true })
	},
	[ActionTypes.CHAT_GET_RECIPIENT_CONVERSATION_SUCCESS](state, action) {
		const _messages = action.payload.page === 1 ? action.payload.result : R.uniq([...state.messages, ...action.payload.result]);
		const allLoaded = action.payload.page >= action.payload.pages;

		return Object.assign({}, state, { allLoaded: allLoaded, error: false, loading: false, messages: _messages, page: allLoaded ? state.page : action.payload.page  })
	}
});
