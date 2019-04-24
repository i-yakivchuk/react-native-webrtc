import { addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

// Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
const middleware = createReactNavigationReduxMiddleware(
	"root",
	state => state.nav,
);
const addListener = createReduxBoundAddListener("root");

const customAddNavigationHelper = ({ routerId, dispatch, state }) => {
	const dispatchWrapper = (action) => {
		action.routerId = routerId;
		return dispatch(action);
	};

	return addNavigationHelpers({
		dispatch: dispatchWrapper,
		state,
		addListener
	});
};

export  { customAddNavigationHelper as addNavigationHelpers };