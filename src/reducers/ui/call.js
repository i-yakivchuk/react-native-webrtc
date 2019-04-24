/**
 * Created by ivan on 25.03.18.
 */
import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';


const initialState = {

};


export const call = createReducer(initialState, {
	[ActionTypes.CREATE_CALL_REQUEST](state, action) {
		return Object.assign({}, state, { pending: true, startCallFromSystemCallHistory: false })
	},
	[ActionTypes.SET_CALL_ID](state, action) {
		return Object.assign({}, state, { callId: action.payload })
	},
	[ActionTypes.ON_CALL](state, action) {
		return Object.assign({}, state, { callCounter: state.callCounter + 1, onCall: action.payload })
	},
	[ActionTypes.EMIT_CALL](state, action) {
		return Object.assign({}, state, { emitCall: action.payload })
	},
	[ActionTypes.ON_CALL_ACCEPTED](state, action) {
		return Object.assign({}, state, { onCallAccepted: action.payload })
	},
	[ActionTypes.EMIT_CALL_ACCEPTED](state, action) {
		return Object.assign({}, state, { emitCallAccepted: action.payload })
	},
	[ActionTypes.ON_COMPLETE_CALL](state, action) {
		return Object.assign({}, state, { onCompleteCall: action.payload })
	},
	[ActionTypes.EMIT_COMPLETE_CALL](state, action) {
		return Object.assign({}, state, { emitCompleteCall: action.payload })
	},
	[ActionTypes.ON_CANCEL_CALL](state, action) {
		return Object.assign({}, state, { onCancelCall: action.payload })
	},
});
