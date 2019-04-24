import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity, AsyncStorage} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import Variables from '../../constants/variables';


/**
 * FileChooserActionSheet component for rendering file upload list type and upload file to server.
 *
 */
class FileChooserActionSheet extends React.Component {

	constructor(props) {
		super(props);
	}

	/**
	 * Show action sheet component.
	 */
	showActionSheet = () => {
		this.actionSheet.show();
	};

	/**
	 * Get FileChooserActionSheet options for rendering
	 *
	 * @protected
	 * @returns {array} The options array for  of this FileChooserActionSheet.
	 */
	getOptions = () => {
		return ['Camera', 'Video', 'Phone Library', 'Cancel'];
	};

	/**
	 * Function run phone camera launch for take photo or video.
	 *
	 * @param type - media type "photo" or "video".
	 */
	launchCamera = (type) => {
		ImagePicker.launchCamera({ mediaType: type }, this.props.onLaunchCamera);
	};

	/**
	 * Function run phone library for select file. Select file type for document all types.
	 */
	launchPhoneLibrary = () => {
		DocumentPicker.show({ filetype: [ DocumentPickerUtil.allFiles() ]}, this.props.onLaunchPhoneLibrary);
	};

	/**
	 * Select action sheet option click event handler.
	 *
	 * @param index - option list selected index.
	 */
	selectOptions = async (index) => {
		await AsyncStorage.setItem('IS_OPEN_FILE', 'true');
		try {
			switch (index) {
				case 0: // index 0 Camera
					this.launchCamera('photo');
					break;
				case 1: // index 1 Video
					this.launchCamera('video');
					break;
				case 2: // index 2 Phone Library
					this.launchPhoneLibrary();
					break;
			}
		} catch (e) {
			await AsyncStorage.setItem('IS_OPEN_FILE', 'false');
			this.props.onErrorHandler();
		}
	};

	render() {
		const options = this.getOptions();

		return (
			<View>
				<TouchableOpacity onPress={this.showActionSheet} style={styles.attachmentIcon}>
					<Entypo name={'attachment'} size={30} color={Variables.darkGrayText} />
				</TouchableOpacity>
				<ActionSheet
					ref={(el) => this.actionSheet = el}
					title={<Text style={styles.title}>Send file</Text>}
					message={<Text>Choose file type to upload...</Text>}
					options={options}
					cancelButtonIndex={options.length - 1}
					onPress={this.selectOptions}
				/>
			</View>
		);
	}
}


/**
 * FileChooserActionSheet component's property types.
 *
 * @static
 */
FileChooserActionSheet.propTypes = {
	onLaunchCamera: PropTypes.func.isRequired,
	onLaunchPhoneLibrary: PropTypes.func.isRequired,
	onErrorHandler: PropTypes.func.isRequired,
};

/**
 * Generic styles for a FileChooserActionSheet component.
 *
 * @type {Object}
 */
const styles = StyleSheet.create({
	title: {
		fontSize: 16,
		color: Variables.black,
	},
	attachmentIcon: {
		marginHorizontal: 10,
		marginVertical: 5
	},
});

export default FileChooserActionSheet;
