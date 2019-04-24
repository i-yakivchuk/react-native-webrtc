import React from "react";
import PropTypes from 'prop-types';
import { Text, TouchableWithoutFeedback, StyleSheet, View, ActivityIndicator } from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import Variables from "../../../../constants/variables";
import GridView from '../../../grid-view';


/**
 * StickerItem component for rendering sticker item for preview.
 *
 * @param item - sticker pack for preview.
 * @param onPress - callback call for item click event.
 * @param onLongPress - callback call for item long click event.
 * @param key - key.
 */
const StickerItem = ({ item, onPress, onLongPress }) => (
	<TouchableWithoutFeedback
		delayLongPress={800}
		onPress={() => { onPress(item); }}
		onLongPress={() => { onLongPress(item); }}
		style={StyleSheet.flatten([styles.item])}
	>
		<CachedImage source={{ uri: item.uri }} style={styles.image} resizeMode={'cover'} />
	</TouchableWithoutFeedback>
);

/**
 * StickerItem component's property types.
 *
 * @static
 */
StickerItem.propTypes = {
	item: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired,
	onLongPress: PropTypes.func.isRequired
};


/**
 * StickerPackPreview - sticker pack preview component.
 *
 * @param loading - show loader indicator.
 * @param items - sticker pack items.
 * @param name - sticker pack name.
 * @param onPress - sticker on press call event.
 * @param onLongPress - sticker on long press call event.
 */
const StickerPackPreview = ({ loading, items, name, onPress, onLongPress }) => (
	<View style={styles.container}>
		{ loading ? (<View style={styles.loader}><ActivityIndicator size='large' color={Variables.primaryColor} animating={true} /></View>) : null }
		<View style={styles.contentContainer}>
			<Text style={styles.packName}>{name}</Text>
			<GridView
				itemDimension={70}
				style={styles.gridView}
				items={items}
				renderItem={(item, i) => (<StickerItem onPress={onPress} onLongPress={onLongPress} key={i} item={item} />)}
			/>
		</View>
	</View>
);

/**
 * StickerPackPreview component's property types.
 *
 * @static
 */
StickerPackPreview.propTypes = {
	items: PropTypes.array.isRequired,
	onPress: PropTypes.func.isRequired,
	onLongPress: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired
};

/**
 * StickerPackPreview component's default property value.
 *
 * @static
 */
StickerPackPreview.defaultProps = {
	items: [],
	loading: false,
	name: '',
	onPress: () => {}
};

/**
 * Generic styles for a StickerPackPreview component.
 *
 * @type {Object}
 */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#E1E7E6',
		flexGrow: 10
	},
	loader: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 25,
		flex: 1,
		flexGrow: 10
	},
	contentContainer: {
		flex: 1,
		paddingHorizontal: 10,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		backgroundColor: '#E1E7E6',
		flexGrow: 10
	},
	gridView: {
		paddingVertical: 10,
		flex: 1,
	},
	packName: {
		fontSize: 15,
		fontFamily: Variables.baseFontSemiBold,
		paddingTop: 12,
		paddingBottom: 6,
		paddingHorizontal: 10
	},
	item: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 15
	},
	image: {
		width: 60,
		height: 60
	}
});

export default StickerPackPreview;
