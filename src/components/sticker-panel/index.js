/**
 * Created by ivan on 22.10.18.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Animated, ScrollView, StyleSheet, Keyboard} from 'react-native';
import Variables from '../../constants/variables';
import { StickerBarPreview, StickerPackPreview, StickerPreviewModal } from './components';


/**
 * StickerPanel component for rendering sticker panel for active conversation
 *
 */
class StickerPanel extends React.Component {

	constructor (props) {
		super(props);

		this.state = { stickerPreview: null, height: new Animated.Value(0) };
	}

	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
	}

	/**
	 * @function keyboardDidShow - listener for keyboardDidShow event
	 */
	keyboardDidShow = () => {
		this.togglePanel(false, true);
	};

	/**
	 * @function togglePanel - change panel height for show or hide panel
	 *
	 * @param isShow - show or hide panel
	 * @param force - change height width out animation
	 */
	togglePanel = (isShow = false, force = false) => {
		const height = isShow ? 300 : 0;
		force ? this.setState({ height }) : Animated.spring(this.state.height, { toValue: height, tension: 25 }).start();
	};

	/**
	 * @function toggleStickerPreviewModal - open preview sticker modal
	 *
	 * @param sticker - selected sticker
	 */
	toggleStickerPreviewModal = (sticker = null) => {
		this.setState({ stickerPreview: sticker });
	};

	render () {
		const { items, selectedId, loading, selectedPack } = this.props;
		const name = selectedPack && selectedPack.name ? selectedPack.name : '';
		const stickers = selectedPack&& selectedPack.stickers ? selectedPack.stickers : [];
		const { height, stickerPreview } = this.state;

		return (
			<Animated.View style={[styles.container, { height: height }]}>
				<StickerBarPreview
					items={items}
					selectedId={selectedId}
					onPress={this.props.selectStickerPack}
				/>
				<StickerPackPreview
					name={name}
					items={stickers}
					loading={loading}
					delayLongPress={800}
					onLongPress={this.toggleStickerPreviewModal}
					onPress={this.props.selectSticker}
				/>
				<StickerPreviewModal
					visible={!!stickerPreview}
					url={stickerPreview ? stickerPreview.uri : ''}
					onClose={this.toggleStickerPreviewModal}
				/>
			</Animated.View>
		)
	}
}

/**
 * StickerPanel component's property types.
 *
 * @static
 */
StickerPanel.propTypes = {
	items: PropTypes.array.isRequired,
	selectedId: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	selectedPack: PropTypes.object.isRequired,
	selectStickerPack: PropTypes.func.isRequired,
	selectSticker: PropTypes.func.isRequired,
};

/**
 * Generic styles for a StickerPanel component.
 *
 * @type {Object}
 */
const styles = StyleSheet.create({
	container: {
		backgroundColor: Variables.lightGray,
		width: '100%'
	}
});

export default StickerPanel;
