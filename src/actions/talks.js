/**
 * Created by ivan on 07.06.18.
 */
import { normalize } from 'normalizr';
import * as TalksActions from '../constants/actions';
import { conversationsSchema } from '../normalizr';
import * as api from '../api/talks';
import { Alert } from "react-native";
import WebSocketProvider from '../api/webSocket';
import {selectConversation, setMessagesAsReadError, setMessagesAsReadSuccess} from './chat';
import { NavigationActions } from 'react-navigation';
import * as localPushService from './../services/local-push-notification';

//get conversations
export const refreshConversationsRequest = () => ({ type: TalksActions.TALKS_REFRESH_CONVERSATIONS });
export const getConversationsRequest = () => ({ type: TalksActions.TALKS_GET_CONVERSATIONS_REQUEST });
export const getConversationsError = () => ({type: TalksActions.TALKS_GET_CONVERSATIONS_ERROR });
export const getConversationsSuccess = (conversations) => ({ type: TalksActions.TALKS_GET_CONVERSATIONS_SUCCESS, payload: conversations });
export function getConversations(page, isRefresh = false) {
	return async (dispatch) => {
		isRefresh ? dispatch(refreshConversationsRequest) : dispatch(getConversationsRequest());

		try {
			const resp = await api.getConversations(page);
			const conversationsNorm = normalize(resp.result, [conversationsSchema]);
			const _result = Object.assign({}, conversationsNorm, { page: resp.page, pages: resp.pages });
			dispatch(getConversationsSuccess(_result));
		} catch (error) {
			dispatch(getConversationsError());
		}
	};
}


//update last message conversation
export const updateLastMessageRequest = (message) => ({ type: TalksActions.TALKS_UPDATE_LAST_MSG_CONVERSATIONS_REQUEST, payload: message });
export const updateLastMessageError = () => ({type: TalksActions.TALKS_UPDATE_LAST_MSG_CONVERSATIONS_ERROR });
export const updateLastMessage = (message) => (dispatch) => {
	try {
		dispatch(updateLastMessageRequest(message));
	} catch (e) {
		dispatch(updateLastMessageError());
	}
};


//update read status for last message conversation
export const updateLastMessageStatusRequest = (message) => ({ type: TalksActions.TALKS_UPDATE_LAST_MSG_STATUS_CONVERSATIONS_REQUEST, payload: message });
export const updateLastMessageStatusError = () => ({type: TalksActions.TALKS_UPDATE_LAST_MSG_STATUS_CONVERSATIONS_ERROR });
export const updateLastMessageStatus = (message) => (dispatch) => {
	try {
		dispatch(updateLastMessageStatusRequest(message));
	} catch (e) {
		dispatch(updateLastMessageStatusError());
	}
};


// add contact to choice talk
export const choiceContactTalk = (id) => ({ type: TalksActions.TALKS_CHOICE_CONTACT, payload: id });
export const clearChoiceContactTalk = (id) => ({ type: TalksActions.TALKS_CLEAR_CHOICE_CONTACT });


// create conversation group
export const createConversationGroupSuccess = () => ({ type: TalksActions.TALKS_CREATE_CONVERSATIONS_GROUP_SUCCESS });
export const createConversationGroupRequest = () => ({ type: TalksActions.TALKS_CREATE_CONVERSATIONS_GROUP_REQUEST });
export const createConversationGroupError = () => ({ type: TalksActions.TALKS_CREATE_CONVERSATIONS_GROUP_ERROR });
export const createConversationGroup = (params, nav) => (dispatch, getState) => {
	const { title } = params;
	const participants = getState().ui.talks.choiceContacts;

	dispatch(createConversationGroupRequest());

	return api.createConversationGroup({ title: title.trim(), participants }).then(res => {
		dispatch(createConversationGroupSuccess());
		dispatch(getConversations(1));
		nav.pop(3);
	}).catch((e) => {
		dispatch(createConversationGroupError(e));

		Alert.alert(
			"Error",
			"System error. Please try again later.",
			[
				{ text: 'OK', onPress: () => {}, style: 'cancel' },
			], { cancelable: false });
	});
};

// leave from group conversation
export const leaveConversationGroupSuccess = () => ({ type: TalksActions.TALKS_LEAVE_CONVERSATIONS_GROUP_SUCCESS });
export const leaveConversationGroupError = () => ({ type: TalksActions.TALKS_LEAVE_CONVERSATIONS_GROUP_ERROR });
export const leaveConversationGroup = (nav, _conversationId = false) => (dispatch, getState) => {
	let conversationId;

	if (_conversationId) {
		conversationId = _conversationId;
	} else {
		conversationId = getState().ui.chat.selectedConversation;
	}

	return api.leaveConversationGroup(conversationId).then(res => {
		dispatch(leaveConversationGroupSuccess());
		dispatch(getConversations(1, true));
		nav.pop(3);
	}).catch((e) => {
		dispatch(leaveConversationGroupError(e));
		Alert.alert("Error", "System error. Please try again later.", [{ text: 'OK', onPress: () => {}, style: 'cancel' }], { cancelable: false });
	});
};

// add new conversation to list
export const onAddCreatedConversationSuccess = (payload) => ({ type: TalksActions.TALKS_ON_ADD_CREATED_CONVERSATION, payload });
export const onAddCreatedConversation = (conversation) => (dispatch) => {
	try {
		const conversationsNorm = normalize([conversation], [conversationsSchema]);
		dispatch(onAddCreatedConversationSuccess(conversationsNorm));
	} catch (e) {}
};

// on change conversation title
export const onChangeConversationTitle = (payload) => ({ type: TalksActions.TALKS_ON_CHANGE_CONVERSATION_TITLE, payload });

// on add current user to conversation
export const onAddUserToConversation = (conversation) => (dispatch) => {
	try {
		const conversationsNorm = normalize([conversation], [conversationsSchema]);
		dispatch(onAddCreatedConversationSuccess(conversationsNorm));
	} catch (e) {}
};

// on add or remove new participant to exist conversation
export const onAddNewParticipantToConversation = (payload) => ({ type: TalksActions.TALKS_ON_ADD_NEW_PARTICIPANT_TO_CONVERSATION, payload });
export const onRemoveParticipantFromConversation = (payload) => ({ type: TalksActions.TALKS_ON_REMOVE_PARTICIPANT_FROM_CONVERSATION, payload });
export const updateSelectedConversation = (conversation) => (dispatch, getState) => {
	const { conversationId } = conversation;
	const selectedConversationId = getState().ui.chat.selectedConversation;

	if (conversationId === selectedConversationId) {
		dispatch(selectConversation(null));
		dispatch(NavigationActions.navigate({ routeName: 'Talks', key: 'Talks' }));
	}
};

// delete participant form conversation group
export const deleteParticipantFromConversationSuccess = () => ({ type: TalksActions.TALKS_DELETE_PARTICIPANT_FROM_CONVERSATIONS_GROUP_SUCCESS });
export const deleteParticipantFromConversationError = (payload) => ({ type: TalksActions.TALKS_DELETE_PARTICIPANT_FROM_CONVERSATIONS_GROUP_ERROR, payload });
export const deleteParticipantFromConversation = (participantId) => (dispatch, getState) => {
const conversationId = getState().ui.chat.selectedConversation;

	return api.deleteParticipantFromConversationGroup(conversationId, [participantId]).then(res => {

	}).catch((e) => {
		dispatch(deleteParticipantFromConversationError(e));
		Alert.alert("Error", "System error. Please try again later.", [{ text: 'OK', onPress: () => {}, style: 'cancel' }], { cancelable: false });
	});
};

//add participants to conversation group
export const addParticipantsToConversationSuccess = () => ({ type: TalksActions.TALKS_DELETE_PARTICIPANT_FROM_CONVERSATIONS_GROUP_SUCCESS });
export const addParticipantsToConversationError = (payload) => ({ type: TalksActions.TALKS_DELETE_PARTICIPANT_FROM_CONVERSATIONS_GROUP_ERROR, payload });
export const addParticipantsToConversation = (nav) => (dispatch, getState) => {
	const conversationId = getState().ui.chat.selectedConversation;
	const participants = getState().ui.talks.choiceContacts;

	return api.addParticipantsToConversationGroup(conversationId, participants).then(res => {
		nav.pop(1);
	}).catch((e) => {
		dispatch(addParticipantsToConversationError(e));
		Alert.alert("Error", "System error. Please try again later.", [{ text: 'OK', onPress: () => {}, style: 'cancel' }], { cancelable: false });
	});
};


export const updateConversationUnreadCount = () => (dispatch, getState) => {
	return api.getConversationUnreadCount().then(res => {
		dispatch({ type: TalksActions.TALKS_UPDATE_CONVERSTATION_TOTAL_UNREAD_COUNT, payload: res });
		localPushService.updateUnreadConversationCount(res && res.total ? res.total : 0);
	}).catch(() => {});
};


// add user typing text for conversation
export const showConversationTyping = (payload) => ({ type: TalksActions.TALKS_SHOW_TYPING, payload: payload });
export const hideConversationTyping = (payload) => ({ type: TalksActions.TALKS_HIDE_TYPING, payload: payload });
export const conversationTyping = (isShow = true) => (dispatch, getState) => {
	try {
		const conversationId = getState().ui.chat.selectedConversation;
		const data = { conversationId: conversationId };
		const api = WebSocketProvider.getInstance();
		const action = isShow ? 'start_typing' : 'finish_typing';

		api.socket.emit(action, JSON.stringify(data));
		dispatch({ type: TalksActions.EMIT_TALKS_TYPING, payload: { action: action, data: data }});
	} catch (e) {
		dispatch({ type: TalksActions.EMIT_TALKS_TYPING_ERROR });
	}
};
