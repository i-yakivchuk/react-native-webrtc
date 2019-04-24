/**
 * Created by ivan on 22.04.18.
 */
import * as CallActions from '../../constants/actions';
import { endSystemCall } from '../../actions/call';
import InCallManager from 'react-native-incall-manager';
import { AppState, Keyboard } from 'react-native';
import WebSocketProvider from '../../api/webSocket';


export const callMiddleware = store => next => action => {
	let call = store.getState().ui.call;

	if (action.type === CallActions.ON_CALL && (!call.emitCallAccepted && !call.onCallAccepted)) {
		Keyboard.dismiss();
		InCallManager.startRingtone('_DEFAULT_');
	}

	if (action.type === CallActions.RESET_CALL || action.type === CallActions.EMIT_CALL_ACCEPTED) {
		InCallManager.stopRingtone();
		InCallManager.stop();
	}

	if ((action.type === CallActions.RESET_CALL || action.type === CallActions.ON_COMPLETE_CALL || action.type === CallActions.ON_CANCEL_CALL ) && call.systemCallUUID)
		store.dispatch(endSystemCall());

	if (action.type === CallActions.RESET_CALL) {
		const apiSocket = WebSocketProvider.getInstance();
		if (AppState.currentState === 'background' && apiSocket) {
			apiSocket.disconnect();
		}
	}

	return next(action);
};
