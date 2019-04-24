/**
 * Created by ivan on 11.06.18.
 */
import { denormalize } from 'normalizr';
import { conversationsSchema } from '../normalizr'
import R from 'ramda';



const denormalizeContacts = (ids, entities) => denormalize(ids, [conversationsSchema], entities);
const resultSelector = (ids, entities) => R.compose(denormalizeContacts)(ids, entities);
const createContactsReselector = (idsSelector) => createSelector(idsSelector, state => state.entities, resultSelector);

/**
 * Selectors for get conversation title.
 */
export const getCurrentConversationTitle = (state) => {
	const conversation = getCurrentConversation(state);
	return conversation.title || '';
};

/**
 * Selectors for get conversation with sections.
 */
export const getSectionConversationMessages = (state) => {

};
