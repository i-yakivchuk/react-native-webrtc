import * as ActionTypes from '../constants/actions';

export const rehydrateComplete = () => ({ type: ActionTypes.REHYDRATE_COMPLETE });
export const clearApp = () => (dispatch) => { dispatch({ type: ActionTypes.RESET_APP })};
export const closeSlideShow = () => ({ type: ActionTypes.CLOSE_SLIDESHOW });
export const updateInternetConnectioStatus = (status) => ({ type: ActionTypes.UPDATE_INTERNET_STATE_SUCCESS, payload: status  });


//crypt app
export const setEncryptPrivateKey = (key) => ({ type: ActionTypes.SET_ENCRYPT_PRIVATE_KEY, payload: key });
export const setEncryptPublicKey = (key) => ({ type: ActionTypes.SET_ENCRYPT_PUBLIC_KEY, payload: key });
export const setEncryptMessageToken = (token) => ({ type: ActionTypes.SET_ENCRYPT_MESSAGE_TOKEN, payload: token });


// notification received
export const notificationReceived = (notification) => ({ type: ActionTypes.NOTIFICATION_RECEIVED, payload: notification });
export const openCallScreen = () => ({ type: ActionTypes.OPEN_CALL_SCREEEN });
