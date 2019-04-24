/**
 * Created by ivan on 22.04.18.
 */
import { RTCMediaStream, MediaStreamTrack, getUserMedia } from 'react-native-webrtc';
import * as actions from '../constants/actions';
import store from '../store/configureStore';

// base action
export const setLocalStream = (payload) => ({ type: actions.SET_LOCAL_TRACK, payload: payload });
export const loadStreamError = (payload) => ({ type: actions.LOAD_TRACK_ERRO, payload: payload });
export const resetLocalStream = (payload) => ({ type: actions.RESET_LOCAL_TRACK });

/**
 * Action for get local stream video for webrtc.
 */
export function getLocalStream() {
	return new Promise((resolve, reject) => {
		let isFront = true;

		MediaStreamTrack
			.getSources()
			.then(_sourceInfo => {
				let videoSourceId;

				for (let i = 0; i < _sourceInfo.length; i++) {
					const sourceInfo = _sourceInfo[i];

					if(sourceInfo.kind === "video" && sourceInfo.facing === (isFront ? "front" : "back")) {
						videoSourceId = sourceInfo.id;
					}
				}

				return getUserMedia({
					audio: true,
					video: {
						mandatory: {
							minWidth: 500, // Provide your own width, height and frame rate here
							minHeight: 300,
							minFrameRate: 30
						},
						facingMode: (isFront ? "user" : "environment"),
						optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
					}
				});
			})
			.then(stream => { store.dispatch(setLocalStream(stream)); resolve(stream); })
			.catch((e) => { store.dispatch(loadStreamError(e)); reject(e); });
	});
}
