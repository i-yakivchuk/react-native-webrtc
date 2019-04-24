import { createStore, applyMiddleware, compose } from 'redux';
import { AsyncStorage } from 'react-native';
import devTools from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { createLogger } from 'redux-logger';
import {persistStore, autoRehydrate} from 'redux-persist'
import { rehydrateComplete } from './../actions/app';
import { createFilter } from 'redux-persist-transform-filter';
import { callMiddleware } from './middlewares';


const isDev = process.env.NODE_ENV === "development";
let logger = createLogger({duration: false, timestamp: false, collapsed: false });


const enhancer =
	isDev ?
		compose(applyMiddleware(callMiddleware, fileMiddleware, thunk, logger), devTools(), autoRehydrate())
		: compose(applyMiddleware(callMiddleware, fileMiddleware, thunk), autoRehydrate());


const configureStore = (initialState) => createStore(rootReducer, initialState, enhancer);
const store = configureStore();


const saveUiSubsetFilter = createFilter();
const saveEntitiesSubsetFilter = createFilter();
export const persist = persistStore(store, {
		storage: AsyncStorage,
		blacklist: [],
		transforms: [
			saveUiSubsetFilter,
			saveEntitiesSubsetFilter
		]
	},
	() => { store.dispatch(rehydrateComplete())}
);
export default store;
