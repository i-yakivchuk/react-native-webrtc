/**
 * @function formattedCallTime - function return formatted call time.
 *
 * @param secs - time in seconds.
 * @returns {string} - formatted time.
 */
export const formattedCallTime = (secs) => {
	
};

/**
 * @function getSizeFormat - function return format file size for app B, KB, MB, GB.
 *
 * @param size - bytes file size.
 * @returns {string} - format file size.
 */
export const getSizeFormat = (size) => {
	
};

/**
 * @function getFileFormat - function return file format by file name.
 *
 * @param name - file name.
 * @returns {*} - file format.
 */
export const getFileFormat = (name) => {
	return name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1);
};
