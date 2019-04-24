import { Platform, NativeModules } from 'react-native';
import firebase from "react-native-firebase";
import Variables from '../constants/variables';


/**
 * @function cancelNotification - cancel notification by id
 *
 * @param notificationId - notification id
 */
const cancelNotification = (notificationId) => {
	if (!notificationId) return false;
	firebase.notifications().removeDeliveredNotification(notificationId).catch(err => console.error(err));
};

/**
 * @function showLocalChatNotification - show local notification for new messages
 *
 * @param action - chat info data
 */
const showLocalChatNotification = (action) => {
	
};

/**
 * @function updateUnreadConversationCount - update app icon badge for unread conversation count
 *
 * @param count - unread conversation count
 */
const updateUnreadConversationCount = (count = 0) => {
	
};

export {
	cancelNotification,
	showLocalChatNotification,
	updateUnreadConversationCount
};
