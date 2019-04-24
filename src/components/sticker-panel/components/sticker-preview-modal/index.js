import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Modal, TouchableWithoutFeedback } from 'react-native';
import { CachedImage } from 'react-native-cached-image';


/**
 * StickerPreviewModal component for rendering sticker preview modal.
 *
 * @param url - sticker url for preview.
 * @param visible - show preview modal.
 * @param onClose - callback function for close preview modal.
 */
const StickerPreviewModal = ({ url, visible, onClose }) => (
	<Modal transparent={true} animationType={'fade'} visible={visible} onRequestClose={() => { onClose(); }}>
		<TouchableWithoutFeedback onPress={() => { onClose(); }}  style={styles.container}>
			<View style={styles.background}>
				<View style={styles.content}>
					<CachedImage source={{ uri: url }} style={styles.image} resizeMode={'cover'} />
				</View>
			</View>
		</TouchableWithoutFeedback>
	</Modal>
);

/**
 * StickerPreviewModal component's property types.
 *
 * @static
 */
StickerPreviewModal.propTypes = {
	url: PropTypes.string.isRequired,
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

/**
 * Generic styles for a StickerPreviewModal component.
 *
 * @type {Object}
 */
const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	background: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	content: {
		backgroundColor: 'transparent',
		display: 'flex',
		height: 260,
		width: 260,
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		height: 260,
		width: 260
	}
});

export default StickerPreviewModal;
