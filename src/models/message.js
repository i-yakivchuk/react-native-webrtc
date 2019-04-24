import R from "ramda";
import config from '../../config';


/**
 * @function getUsersReadMessage - get users who message read
 *
 * @param participants - conversation participants
 * @param readBy - message read by users
 */
export const getUsersReadMessage = (readBy= [], participants = []) => participants.filter(item => R.contains(item.id, readBy)) || [];


/**
 * @function getMessageStickerUrl - get sticker image url
 *
 * @param sticker - sticker object
 * @param stickerBaseUrl - base sticker url for load image
 * @returns {string} - sticker image url
 */
export const getMessageStickerUrl = (sticker = '', stickerBaseUrl = '') => {
	

	return `${apiUrl}${stickerBaseUrl}/${_sticker.packId}/${_sticker.file}`;
};
