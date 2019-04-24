/**
 * Created by ivan on 16.03.18.
 */
import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';
import { mergeEntitiesDeep, mergeListsDeep }  from '../../util/reducerUtils';

export const users = createReducer([], {
	[ActionTypes.LOGOUT_SUCCESS](state, action) {
		const userNoAccessId = { id: action.payload, token: null };
		return mergeListsDeep(state, [userNoAccessId]);
	},
	[ActionTypes.DEFAULT](state, action) {
		return mergeEntitiesDeep(state, action, 'users');
	}
});
