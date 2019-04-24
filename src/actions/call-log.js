/**
 * Created by ivan on 20.04.18.
 */
import * as CallLogActions from '../constants/actions';
import * as api from '../api/call';

// base simple action
export const showCallLogLoader = (show) => ({ type: CallLogActions.GET_CALL_LOG_SHOW_LOADER, payload: show });
export const getCallLogRequest = () => ({ type: CallLogActions.GET_CALL_LOG_REQUEST });
export const getCallLogError = () => ({type: CallLogActions.GET_CALL_LOG_ERROR });
export const getCallLogSuccess = (calls) => ({ type: CallLogActions.GET_CALL_LOG_SUCCESS, payload: calls });

/**
 * Action for get call history.
 *
 * @param isLoader - show loader.
 * @param page - list page.
 */
export function getCallHistory(isLoader, page) {
	return async (dispatch) => {
		dispatch(showCallLogLoader(isLoader));
		dispatch(getCallLogRequest);

		try {
			const resp = await api.getCallHistory(page);
			dispatch(getCallLogSuccess(resp));
			dispatch(showCallLogLoader(typeof isLoader !== 'undefined' ? !isLoader : false));
		} catch (error) {
			dispatch(getCallLogError());
		}
	};
};
