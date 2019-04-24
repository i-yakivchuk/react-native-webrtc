/**
 * Created by ivan on 20.03.18.
 */
import { denormalize } from 'normalizr';
import { contactsSchema } from '../normalizr'
import R from 'ramda';
import { createSelector } from 'reselect';


const denormalizeContacts = (ids, entities) => denormalize(ids, [contactsSchema], entities);
const resultSelector = (ids, entities) => R.compose(denormalizeContacts)(ids, entities);
const createContactsReselector = (idsSelector) => createSelector(idsSelector, state => state.entities, resultSelector);

// base contacts selectors
export const getUserContacts = createContactsReselector(state => state.ui.contacts.list);
export const getSelectedContact = R.compose(R.head, createContactsReselector(state => [state.ui.contacts.selected]));
export const getContact = R.compose(R.head, createContactsReselector(id => [id]));

