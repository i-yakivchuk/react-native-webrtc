import { connect } from 'react-redux';
import FileChooser from '../../../../components/file-chooser-action-sheet';

/**
 * Component redux connect for file chooser.
 *
 */

const mapStateToProps = (state) => ({ });

const mapDispatchToProps = (dispatch) => ({ dispatch });

const mergeProps = (state, { dispatch }, ownProps) => ({
	...state,
	...ownProps,
	onLaunchCamera(file) {

	},
	onLaunchPhoneLibrary(error, file) {

	},
	onErrorHandler() {

	}
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FileChooser);
