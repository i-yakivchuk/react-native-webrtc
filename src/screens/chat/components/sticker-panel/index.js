import { connect } from 'react-redux';
import StickerPanel from '../../../../components/sticker-panel';
import * as stickersActions from '../../../../actions/stickers';
import { selectors as stickersSelector, actions as StickerActionsss } from '../../../../store/modules/stickers';

const mapStateToProps = (state) => ({
	items: stickersSelector.getUserStickers(state),
	loading: stickersSelector.getStickerLoading(state),
	selectedId: stickersSelector.getSelectedPackId(state),
	selectedPack: stickersSelector.getSelectedStickerPack(state),
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

const mergeProps = (state, { dispatch }, ownProps) => ({
	...state,
	...ownProps,
	selectStickerPack(id) {
		dispatch(stickersActions.selectStickerPack(id));
	},
	selectSticker(sticker) {
		dispatch(StickerActionsss.sendSticker(sticker));
	}
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { withRef: true })(StickerPanel);
