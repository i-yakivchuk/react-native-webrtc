import React from 'react';
import PropTypes from 'prop-types';
import { CachedImage } from 'react-native-cached-image';
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Variables from "../../../../constants/variables";


/**
 * StickerBarItem component for rendering sticker item pack preview for StickerBarPreview component.
 *
 * @param item - sticker pack for preview.
 * @param selected - is selected pack for preview.
 * @param onPress - callback call for item click event.
 * @param key - key.
 */
const StickerBarItem = ({ item, selected, onPress }) => (
	<TouchableOpacity onPress={() => { onPress(item.id); }} style={[styles.item, selected && styles.selectItem]}>
		<CachedImage source={{ uri: item.uri }} style={styles.image} resizeMode={'cover'} />
	</TouchableOpacity>
);

/**
 * StickerBarItem component's property types.
 *
 * @static
 */
StickerBarItem.propTypes = {
	item: PropTypes.object.isRequired,
	selected: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired
};


/**
 * StickerBarPreview - component for rendering sticker pack preview bar.
 *
 * @param items - sticker packs.
 * @param selectedId - selected sticker pack id.
 * @param onPress - function for select pack.
 */
const StickerBarPreview = ({ items, selectedId, onPress }) => (
	<ScrollView
		horizontal
		pagingEnabled
		scrollEventThrottle={10}
		style={styles.container}
		showsHorizontalScrollIndicator={true}
		contentContainerStyle={styles.contentContainer}
	>
		{ items.map((item, i) => (<StickerBarItem item={item} selected={item.id === selectedId} key={i}  onPress={onPress} />)) }
	</ScrollView>
);

/**
 * StickerBarPreview component's property types.
 *
 * @static
 */
StickerBarPreview.propTypes = {
	items: PropTypes.array.isRequired,
	onPress: PropTypes.func.isRequired,
	selectedId: PropTypes.string.isRequired
};

/**
 * StickerBarPreview component's default property value.
 *
 * @static
 */
StickerBarPreview.defaultProps = {
	items: [],
	selectedId: null,
	onPress: () => {}
};

/**
 * Generic styles for a StickerBarPreview component.
 *
 * @type {Object}
 */
const styles = StyleSheet.create({
	container: {
		height: 35,
		backgroundColor: Variables.lightGray,
		borderBottomWidth: 0.5,
		borderBottomColor: Variables.baseBorderColor
	},
	contentContainer: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12
	},
	item: {
		padding: 10
	},
	selectItem: {
		padding: 8,
		borderRadius: 6,
		backgroundColor: '#DDDDDD'
	},
	image: {
		width: 30,
		height: 30
	}
});

export default StickerBarPreview;
