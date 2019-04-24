/**
 * Created by ivan on 11.06.18.
 */
import * as CryptoJS from 'crypto-js';
import * as ChatActions from '../constants/actions';
import { normalize } from 'normalizr';
import { conversationsSchema } from '../normalizr';
import R from 'ramda';
import store from '../store/configureStore';
import * as api from '../api/talks';
import WebSocketProvider from '../api/webSocket';
import { updateLastMessage, updateLastMessageStatus, getConversations } from './talks';

import { getSelectedConversationId } from '../selectors/chat';
import { getMessageToken, getConversationsList } from '../selectors/talks';
import { getCurrent } from '../selectors/users';
import * as localPushService from './../services/local-push-notification';


//select conversation
export const selectConversation = (id) => ({ type: ChatActions.CHAT_SELECT_CONVERSATION, payload: id });


//get conversation messages
export const getConversationMessagesSuccess = (conversation) => ({ type: ChatActions.CHAT_GET_RECIPIENT_CONVERSATION_SUCCESS, payload: conversation });
export const getConversationMessagesRequest = () => ({ type: ChatActions.CHAT_GET_RECIPIENT_CONVERSATION_REQUEST });
export const getConversationMessagesError = () => ({ type: ChatActions.CHAT_GET_RECIPIENT_CONVERSATION_ERROR });
export const getConversationMessages = (page = 1) => (dispatch) => {
	const conversationId = getSelectedConversationId(store.getState());

	if (!conversationId) { //if error
		dispatch(getConversationMessagesError());
		return false;
	}

	dispatch(getConversationMessagesRequest());
	return api.getRecipientConversation(conversationId, page).then(res => {
		dispatch(getConversationMessagesSuccess(res));
	}).catch(() => {
		dispatch(getConversationMessagesError());
	});
};


//create new conversation
export const createConversationRequest = () => ({ type: ChatActions.CHAT_CREATE_CONVERSATION_REQUEST });
export const createConversationError = () => ({type: ChatActions.CHAT_CREATE_CONVERSATION_ERROR });
export const createConversationSuccess = (conversation) => ({ type: ChatActions.CHAT_CREATE_CONVERSATION_SUCCESS, payload: conversation });
export const createConversation = (contactId) => (dispatch, getState) => api.createConversation(contactId);

//send new conversation message
export const sendConversationMessageRequest = () => ({ type: ChatActions.CHAT_SEND_MESSAGE_REQUEST });
export const sendConversationMessageError = () => ({type: ChatActions.CHAT_SEND_MESSAGE_ERROR });
export const sendConversationSuccess = (message) => ({ type: ChatActions.CHAT_SEND_MESSAGE_SUCCESS, payload: message });
export function sendConversationMessage(message) {
	return async (dispatch) => {
		dispatch(sendConversationMessageRequest());

		try {
			const api = WebSocketProvider.getInstance();
			const user = getCurrent(store.getState());
			const conversationId = getSelectedConversationId(store.getState());
			const messageToken = getMessageToken(store.getState());
			const encrypted = CryptoJS.AES.encrypt(message, messageToken);
			const messageTempId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			const data = JSON.stringify({ messageTempId: messageTempId, conversationId: conversationId, message: encrypted.toString() });

			// send conversation message
			api.socket.emit('conversation_message', data);

			dispatch(sendConversationSuccess());
			dispatch(addMessage(Object.assign({}, { allRead: true, id: messageTempId, conversationId: conversationId, message: message, from: user, createdAt: new Date(), updatedAt: new Date() })));
		} catch (e) {
			console.log(e);
			dispatch(sendConversationMessageError());
		}
	};
}


//add conversation message
export const addMessageRequest = () => ({ type: ChatActions.CHAT_ADD_MESSAGE_REQUEST });
export const addMessageError = () => ({type: ChatActions.CHAT_ADD_MESSAGE_ERROR });
export const addMessageSuccess = (message) => ({ type: ChatActions.CHAT_ADD_MESSAGE_SUCCESS, payload: message });
export const updateMessageUploadProgress = (message) => ({ type: ChatActions.CHAT_UPDATE_MESSAGE_UPLOAD_PROGRESS_SUCCESS, payload: message });
export const messageFileUploaded = (message) => ({ type: ChatActions.MESSAGE_FILE_UPLOADED_DONE, payload: message });
export const messageFileUploadedProgress = (message) => ({ type: ChatActions.MESSAGE_FILE_UPLOADED_PROGRESS, payload: message });
export const cancelMessageFileUpload = (message) => ({ type: ChatActions.CHAT_CANCEL_MESSAGE_FILE_UPLOAD, payload: message });

export const addMessage = (msg) => (dispatch) => {
	dispatch(addMessageRequest());

	try {
		const { conversationId, message, id, from, updatedAt, createdAt, allRead, type } = msg;
		const selectedConversationId = getSelectedConversationId(store.getState());

		if (conversationId === selectedConversationId) {
			dispatch(addMessageSuccess(Object.assign({}, { allRead, id: id, selectedConversationId, createdAt, updatedAt, author: from, body: message }, (type ? { type } : {}))));
		} else {
			if (type === 'sticker') {
				try {
					const sticker = JSON.parse(msg);
					msg = sticker.code;
				} catch (e) {}
			}

			localPushService.showLocalChatNotification(msg);
		}

		dispatch(getConversations(1));
	} catch (e) {
		dispatch(addMessageError());
	}
};


//update message hash id
export const updateMessageTempIdRequest = (message) => ({ type: ChatActions.CHAT_UPDATE_MESSAGE_TEMP_ID_REQUEST, payload: message });
export const updateMessageTempIdError = () => ({type: ChatActions.CHAT_UPDATE_MESSAGE_TEMP_ID_ERROR });
export const updateMessageTempId = (message) => (dispatch) => {
	try {
		const { conversationId } = message;
		const selectedConversationId = getSelectedConversationId(store.getState());

		if (conversationId === selectedConversationId)
			dispatch(updateMessageTempIdRequest(message));
	} catch (e) {
		dispatch(updateMessageTempIdError());
	}
};


//set message as read
export const setMessagesAsReadRequest = () => ({ type: ChatActions.CHAT_SET_MESSAGE_AS_READ_REQUEST });
export const setMessagesAsReadSuccess = (payload) => ({ type: ChatActions.CHAT_SET_MESSAGE_AS_READ_SUCCESS, payload });
export const setMessagesAsReadError = () => ({type: ChatActions.CHAT_SET_MESSAGE_AS_READ_ERROR });
export const setMessagesAsRead = (messages = []) => (dispatch) => {
	dispatch(setMessagesAsReadRequest());

	try {
		const selectedConversationId = getSelectedConversationId(store.getState());
		const api = WebSocketProvider.getInstance();

		let ids = messages.filter((msg) => msg.id).map((msg) => msg.id);
		const data = JSON.stringify({ conversationId: selectedConversationId, messageId: ids });

		api.socket.emit('read', data);
		dispatch(setMessagesAsReadSuccess({messages}));
	} catch (e) {
		dispatch(setMessagesAsReadError());
	}
};


//update message read status
export const updateMessageStatusRequest = (message) => ({ type: ChatActions.CHAT_UPDATE_MESSAGE_STATUS_REQUEST, payload: message });
export const updateMessageStatusError = () => ({type: ChatActions.CHAT_UPDATE_MESSAGE_STATUS_ERROR });
export const updateMessageStatus = (message) => (dispatch) => {
	try {
		const { conversationId } = message;
		const selectedConversationId = getSelectedConversationId(store.getState());

		if (conversationId === selectedConversationId)
			dispatch(updateMessageStatusRequest(message));

		dispatch(updateLastMessageStatus(message));
	} catch (e) {
		dispatch(updateMessageStatusError());
	}
};

//update message og tags
export const updateMessageOgTagsRequest = (message) => ({ type: ChatActions.CHAT_UPDATE_MESSAGE_OG_TAGS_REQUEST, payload: message });
export const updateMessageOgTagsError = () => ({type: ChatActions.CHAT_UPDATE_MESSAGE_OG_TAGS_ERROR });
export const updateMessageOgTags = (message) => (dispatch) => {
	try {
		const { conversationId } = message;
		const selectedConversationId = getSelectedConversationId(store.getState());

		if (conversationId === selectedConversationId)
			dispatch(updateMessageOgTagsRequest(message));
	} catch (e) {
		dispatch(updateMessageOgTagsError());
	}
};
