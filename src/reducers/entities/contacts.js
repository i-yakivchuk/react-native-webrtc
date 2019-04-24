/**
 * Created by ivan on 20.03.18.
 */
import createReducer from '../createReducer';
import * as ActionTypes from '../../constants/actions';


/**
 * Contacts entities reducer.
 */
export const contacts = createReducer([], {
	[ActionTypes.UPDATE_CONTACT_CS](state, action) {
		const id = action.payload.userId;
		return {
			...state,
			[id]: {
				...state[id],
				lastActivity: new Date(),
				is_online: action.payload.status
			}
		};
	},
	[ActionTypes.DEFAULT](state, action) {
		return mergeEntities(state, action, 'contacts');
	}
});
