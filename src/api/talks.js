/**
 * Created by ivan on 08.06.18.
 */
import request from './request';

/**
 * Function for get user conversations.
 */
export function getConversations(page = 1) {
	return request.get('conversation', { page: page });
}

/**
 * Function for get recipient by conversation id.
 */
export function getRecipientConversation(conversationId, page = 1) {
	return request.get(`conversation/${conversationId}/history`, { page: page });
}

/**
 * Function for create new conversation.
 */
export function createConversation(participant) {
	return request.post(`conversation/dialog`, { participant });
}

/**
 * Function for create new conversation group.
 */
export function createConversationGroup({ title, participants }) {
	return request.post(`conversation`, { title, participants });
}
