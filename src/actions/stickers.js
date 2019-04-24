import * as stickerActions from '../constants/actions';
import * as api from '../api/talks';
import { normalize } from 'normalizr';


// get stickers packs
export const getStickerPacksRequest = () => ({ type: stickerActions.GET_STICKER_PACKS_REQUEST });
export const getStickerPacksSuccess = (stickers) => ({ type: stickerActions.GET_STICKER_PACKS_SUCCESS, payload: stickers });
export const getStickerPacks = () => (dispatch) => {
	dispatch(getStickerPacksRequest());

	return api.getStickerPacks().then((res) => {
		dispatch(getStickerPacksSuccess(res));
		res.packs ? dispatch(selectStickerPack(res.packs[0] ? res.packs[0]['id'] : null)): null;
	});
};


// get sticker pack by id for preview
export const selectStickerPackRequest = (id) => ({ type: stickerActions.SELECT_STICKER_PACK_REQUEST, payload: { id } });
export const selectStickerPackSuccess = (stickers) => ({ type: stickerActions.SELECT_STICKER_PACK_SUCCESS, payload: stickers });
export const selectStickerPack = (id) => (dispatch) => {
	if (!id) return false;

	dispatch(selectStickerPackRequest(id));

	return api.getStickerPack(id).then((res) => {
		dispatch(selectStickerPackSuccess(res));
	});
};
