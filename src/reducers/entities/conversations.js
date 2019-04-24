/**
 * Created by ivan on 20.03.18.
 */
import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';
import { mergeEntities }  from '../../util/reducerUtils';
import R from 'ramda';

/**
 * Conversation entities reducer.
 */
export const conversations = createReducer([], {
	[ActionTypes.TALKS_UPDATE_LAST_MSG_STATUS_CONVERSATIONS_REQUEST](state, action) {
		const id = action.payload.conversationId;
		const messageId = action.payload.messageId;
		let conversation = state[id];
		let lastMessage = conversation.lastMessage;

		if (lastMessage && lastMessage.id) {
			if (messageId === lastMessage.id) {
				lastMessage = Object.assign({}, lastMessage, { readBy: R.uniq([...lastMessage.readBy, ...[action.payload.userId]]) });
			}
		}

		return {
			...state,
			[id]: {
				...state[id],
				lastMessage: Object.assign({}, lastMessage)
			}
		};
	},
	[ActionTypes.TALKS_UPDATE_LAST_MSG_CONVERSATIONS_REQUEST](state, action) {
		const id = action.payload.conversationId;
		return {
			...state,
			[id]: {
				...state[id],
				lastMessage: action.payload
			}
		};
	},
	[ActionTypes.TALKS_ON_CHANGE_CONVERSATION_TITLE](state, action) {
		const id = action.payload.conversationId;
		return {
			...state,
			[id]: {
				...state[id],
				title: action.payload.title
			}
		};
	},
	[ActionTypes.TALKS_ON_ADD_NEW_PARTICIPANT_TO_CONVERSATION](state, action) {
		const id = action.payload.conversationId;
		const participants = action.payload.participantObjects || [];
		return {
			...state,
			[id]: {
				...state[id],
				participants: R.uniq([...state[id]['participants'], ...participants])
			}
		};
	},
	[ActionTypes.DEFAULT](state, action) {
		return mergeEntities(state, action, 'conversations');
	}
});
