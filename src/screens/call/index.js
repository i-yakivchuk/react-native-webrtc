/**
 * Created by ivan on 22.03.18.
 */
import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Modal, Dimensions, Keyboard, Image, TouchableOpacity, TouchableHighlight, Platform } from 'react-native';
import Variables from '../../constants/variables';
import { View, Text } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';


const configuration = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

// Enable playback in silence mode
Sound.setCategory('Playback');


/**
 * Component for rendering user call screen.
 */
class Call extends React.Component {

	constructor(props) {
		super(props);


		this.onMuteAudio = this.onMuteAudio.bind(this);
		this.onMuteVideo = this.onMuteVideo.bind(this);
		this.onCancelCall = this.onCancelCall.bind(this);
		this.onCallAccepted = this.onCallAccepted.bind(this);
		this.renderVideoCallWebRTC = this.renderVideoCallWebRTC.bind(this);
		this.renderAudioCallWebRTC = this.renderAudioCallWebRTC.bind(this);
		this.setSpeakerPhoneOn = this.setSpeakerPhoneOn.bind(this);
		this.renderSelfVideoPreviewWebRTC = this.renderSelfVideoPreviewWebRTC.bind(this);

		//pr
		this.connect = this.connect.bind(this);
		this.errorHandler = this.errorHandler.bind(this);
		this.createAnswer = this.createAnswer.bind(this);
		this.setRemoteSDP = this.setRemoteSDP.bind(this);
		this.addIceCandidate = this.addIceCandidate.bind(this);
		this.gotIceCandidate = this.gotIceCandidate.bind(this);
		this.createdDescription = this.createdDescription.bind(this);
		this.handleStartTimer = this.handleStartTimer.bind(this);
		this.handleResetTimer = this.handleResetTimer.bind(this);
	}

	/**
	 * Start timer for call interval.
	 */
	handleStartTimer() {
		this.incrementer = BackgroundTimer.setInterval(() => this.setState({ secondsElapsed: this.state.secondsElapsed + 1 }), 1000);
	}

	/**
	 * Function for stop call interval time.
	 */
	handleResetTimer() {
		BackgroundTimer.clearInterval(this.incrementer);
		this.setState({ secondsElapsed: 0 });
	}

	/**
	 * Function for create connect for call.
	 * @param isCaller
	 */
	connect(isCaller) {

	}

	/**
	 * Emit got ice candidate for connect peer to peer.
	 * @param event
	 */
	gotIceCandidate(event) {
		const { onCall, emitCall } = this.props;

		if (event.candidate !== null) {
			const socket = WebSocketProvider.getInstance().socket;
			const userId = onCall ? onCall.caller.id : emitCall ? emitCall.id : null;

			if (userId)
				socket.emit('ice', JSON.stringify({ user: userId, candidate: event.candidate }));
		}
	}

	/**
	 * Function for add ice candidate for peer to peer connection.
	 * @param candidate
	 */
	addIceCandidate(candidate) {
		if (this.state.pr)
			this.state.pr.addIceCandidate(new RTCIceCandidate(candidate)).catch(this.errorHandler);
	}

	/**
	 * Function for create caller answer for peer to peer.
	 *
	 * @param caller
	 */
	createAnswer(caller) {
		if (this.state.pr) {
			this.state.pr.createAnswer((offer) => {
				this.state.pr.setLocalDescription(offer, () => {
					const socket = WebSocketProvider.getInstance().socket;
					socket.emit('sdp', JSON.stringify({user: caller, answer: offer}));
				}, (err) => this.errorHandler);
			}, (err) => this.errorHandler);
		}
	}

	/**
	 * Set remote stp peer to peer
	 * @param sdp
	 */
	setRemoteSDP(sdp) {
		if (this.state.pr) {
			let desc = sdp.offer ? sdp.offer : sdp.answer;
			this.state.pr.setRemoteDescription(new RTCSessionDescription((sdp.offer ?  {type: 'offer', sdp: desc } : desc)), () => {
				if (this.state.pr.remoteDescription.type === 'offer') this.createAnswer(sdp.caller);
			}, (err) => { this.errorHandler(err); });
		}
	}

	/**
	 * Error handler.
	 * @param event
	 */
	errorHandler(event) {

	}

	/**
	 * Event function when user accept call.
	 */
	onCallAccepted() {

	}

	/**
	 * Event function when user cancel call.
	 */
	onCancelCall() {
		this.props.emitCancelCall();
	}

	/**
	 * Function for mute audio call.
	 */
	onMuteAudio() {
		const { localStream } = this.props;
		this.setState({ isMuteAudio: !this.state.isMuteAudio });
		localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
	}

	/**
	 * Function for mute video call.
	 */
	onMuteVideo() {
		if (this.state.secondsElapsed) {
			const { isLocalVideo } = this.props;
			this.props.setEnableLocalVideo(!isLocalVideo);
		}
	}

	/**
	 * Function for set phone speaker.
	 */
	setSpeakerPhoneOn() {
		const { isSpeakerPhoneOn } = this.props;
		this.props.setSpeakerPhoneOn(!isSpeakerPhoneOn);

		if (this.outgoingSound) {
			this.outgoingSound.setSpeakerphoneOn(!isSpeakerPhoneOn);
		}
	}

	/**
	 * Function for render call buttons component.
	 * @returns {*}
	 */
	renderCallButton() {
		return (
			<View style={StyleSheet.flatten(styles.row)}>
				<TouchableOpacity onPress={this.onCallAccepted} style={StyleSheet.flatten([styles.callBtn, {backgroundColor: '#32ff32'}])}>
					<Icon name={'md-call'} size={44} color={Variables.white} />
				</TouchableOpacity>
				<TouchableOpacity onPress={this.onCancelCall} style={StyleSheet.flatten(styles.callBtn)}>
					<Icon name={'md-close'} size={45} color={Variables.white} />
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 * Render call info details.
	 * @returns {*}
	 */
	renderCallInfo() {
		const { call: { onCall, emitCall, emitCallAccepted, onCallAccepted} }  = this.props;
		const firstName = emitCall ? emitCall.first_name : onCall ? onCall.caller.first_name : '';
		const lastName = emitCall ? emitCall.last_name : onCall ? onCall.caller.last_name : '';
		const status = (emitCall && !onCallAccepted) || (onCall && !emitCallAccepted) ? 'Connecting...' : false;

		return (
			<View stule={StyleSheet.flatten(styles.callInfoBlock)}>
				<Text style={StyleSheet.flatten(styles.callInfoName)}>{firstName}{' '}{lastName}</Text>
				<Text style={StyleSheet.flatten(styles.callInfoStatus)}>
					{ status ? status : formattedCallTime(this.state.secondsElapsed) }
				</Text>
			</View>
		);
	}

	/**
	 * Render caller avatar as background  image.
	 */
	renderCallBackgroundImage() {
		const { call: { onCall, emitCall } }  = this.props;
		const avatar = emitCall ? emitCall.avatar : onCall ? onCall.caller.avatar : null;

		return (
			<View style={StyleSheet.flatten(styles.backgroundContainer)}>
				<Image style={StyleSheet.flatten(styles.backgroundImage)} resizeMode={'cover'} source={(avatar ? { uri: avatar } : null )} />
			</View>
		);
	}

	/**
	 * Function for render webrtc component for audio.
	 */
	renderAudioCallWebRTC() {
		const { remoteViewSrc } = this.state;
		return <RTCView mirror={false} zOrder={0} objectFit={'cover'} streamURL={remoteViewSrc} style={StyleSheet.flatten([styles.viewRTCAudio])}/>
	};

	/**
	 * Function for render webrtc component for audio/video.
	 */
	renderVideoCallWebRTC() {
		return (
			( this.state.remoteViewSrc ?
				<View style={StyleSheet.flatten(styles.videoBlock)}>
					<RTCView mirror={false} zOrder={1} objectFit={'cover'} streamURL={this.state.remoteViewSrc} style={StyleSheet.flatten([styles.selfView])}/>
				</View>
				: null
			)
		);
	}

	/**
	 * Render self video preview.
	 */
	renderSelfVideoPreviewWebRTC() {
		const { localStream } = this.props;
		return (
			( this.state.remoteViewSrc ?
				<View style={StyleSheet.flatten(styles.previewBlock)}>
					<RTCView objectFit={'cover'} zOrder={2} streamURL={localStream.toURL()} style={StyleSheet.flatten([styles.remoteView])}/>
				</View>
				: null
			)
		);
	}
}


const select = (state) => ({
	isVideoCall: state.ui.call.isVideoCall,
	isRemoteVideo: state.ui.call.remoteVideo,
	isLocalVideo: state.ui.call.localVideo,
	isSpeakerPhoneOn: state.ui.call.isSpeakerPhoneOn,
	call: state.ui.call,
	onCall: state.ui.call.onCall,
	emitCall: state.ui.call.emitCall,
	localStream: state.ui.track.localStream,
	systemCallUUID: state.ui.call.systemCallUUID,
});

export default connect(select, { emitAcceptCall, emitCancelCall, setSpeakerPhoneOn, resetCall, emitCompleteCall, setEnableLocalVideo, startIncomingSystemIOSCall })(Call);
