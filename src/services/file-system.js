import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import mime from 'mime-types';
import R from 'ramda';
import { FileSystemService as FSS } from "./index";
import RNFetchBlob from "react-native-fetch-blob";
import {getUserToken} from "../api/request";


/**
 * The absolute path to the external storage for media.
 */
const fsPath = RNFS.ExternalStorageDirectoryPath;

/**
 * Base constant for media folder.
 *
 * @type {{image: string, video: string, audio: string, document: string}}
 */
const BASE_MEDIA_FOLDER = {
	'image': { name: 'Images', types: ['jpg', 'jpeg', 'png', 'bmp'] },
	'video': { name: 'Video', types: ['mp4', 'webm', '3gp', 'flv'] },
	'audio': { name: 'Audio', types: ['mp3', 'wav'] },
	'document': { name: 'Documents', types: ['txt', 'doc', 'pdf', 'docx'] },
	'other': { name: 'Other', types: [] }
};

/**
 * @function getPath - function return base path for media folder for selected file.
 *
 * @param name - file name.
 * @returns {string}
 */
const getPath = (name) => {
	
	return ``;
};

/**
 * @function getFileMimeType - function for get mime file type by file name.
 *
 * @param name - file name.
 * @returns {boolean|string|boolean|string} - file mime type.
 */
const getFileMimeType = (name) => {
	return mime.lookup(name) || 'none';
};

/**
 * @function getSizeFormat - function return format file size for app B, KB, MB, GB.
 *
 * @param size - bytes file size.
 * @returns {string} - format file size.
 */
const getSizeFormat = (size) => {
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
};

/**
 * @function getFileFormat - function return file format by file name.
 *
 * @param name - file name.
 * @returns {*} - file format.
 */
const getFileFormat = (name) => {
	return name.slice((Math.max(0, name.lastIndexOf('.')) || Infinity) + 1);
};

/**
 * @function getFileType - function for return file type by file name.
 *
 * @param name - file name.
 * @returns {string} - return file type.
 */
const getFileType = (name) => {
	let type = 'other';
	const format = getFileFormat(name);

	Object.keys(BASE_MEDIA_FOLDER).map((key) => {
		if (R.contains(format, BASE_MEDIA_FOLDER[key].types)) { type = key; }
	});

	return type;
};

/**
 * @function asyncCheckFileExists - function for check file exists in base media folder.
 *
 * @param name - file name.
 * @returns {Promise<boolean>}
 */
const asyncCheckFileExists = async (name) => {
	const path = `${getPath(name)}/${name}`;
	const exists = await RNFS.exists(path);

	return exists || false;
};

/**
 * @function asyncGetDestinationFilePath - function check if path exist and create folder if path not exists.
 *
 * @param name - file name.
 */
const asyncGetDestinationFilePath = async (name) => {
	const path = getPath(name);
	const exists = await RNFS.exists(path);

	if (!exists) {
		await RNFS.mkdir(path);
	}

	return `${getPath(name)}`;
};

/**
 * @function getFileNameFromPath - function return file name from file full path.
 *
 * @param path - file path.
 * @returns {*} - file name.
 */
const getFileNameFromPath = (path) => path.replace(/^.*[\\\/]/, '');

/**
 * @function - function for copy file to cache directory
 *
 * @param file - uploaded file
 */
const copyFileToCache = async (file) =>  {
	const name = file.file.fileName;
	const basePath = await FSS.asyncGetDestinationFilePath(name);
	const filePath = `${basePath}/${name}`;
	const exists = await FSS.asyncCheckFileExists(name || '');

	if (!exists) { await RNFS.copyFile(file.file.uri, filePath); }
};

export {
	getPath,
	getFileType,
	getSizeFormat,
	getFileFormat,
	getFileMimeType,
	copyFileToCache,
	asyncCheckFileExists,
	getFileNameFromPath,
	asyncGetDestinationFilePath
};
