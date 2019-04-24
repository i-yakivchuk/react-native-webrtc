/**
 * Created by ivan on 28.05.18.
 */
import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, Linking, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, Alert, Keyboard } from 'react-native';
import { View,  Left, Body, Right, Text, Root } from 'native-base';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import Variables from '../../../../constants/variables';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCurrent } from '../../../../selectors/users';
import ParsedText from 'react-native-parsed-text';
import moment from 'moment';
import { message as messageModel } from '../../../../models';
import * as urlUtils from '../../../../util/urlUtils';
import R from "ramda";
import { CachedImage } from 'react-native-cached-image';
import { StickerMessage, SystemMessage, FileMessage } from '../../../../components/conversation-message';
import { actions as fileActions } from '../../../../store/modules/files';


class MessageItem extends React.Component {

	constructor(props) {
		super(props);
	}


	/**
	 * Function for rendering system message compoenent.
	 */
	renderSystemMessage = () => {
		const { data } = this.props;
		return <SystemMessage text={data.body} />;
	};

	/**
	 *  Function for rendering sticker message compoenent.
	 */
	renderStickerMessage = () => {
		const { conversation, data, user, isDialog, stickerBaseUrl } = this.props;
		const isAuthor = data.author.id === user.id;
		const message = {...data, ...{ participants: conversation.participants }};

		return <StickerMessage stickerBaseUrl={stickerBaseUrl} message={message} userId={user.id} isDialog={isDialog} isAuthor={isAuthor} />;
	};

	/**
	 *  Function for rendering file message compoenent.
	 */
	renderFileMessage = () => {
		const { conversation, data, user, isDialog } = this.props;
		const body = JSON.parse(data.body);
		const message = { ...data, ...{ body: body }, ...{ participants: conversation.participants }};

		return <FileMessage message={message} userId={user.id} isDialog={isDialog} isAuthor={data.author.id === user.id} />
	};

	/**
	 * Function check converstation message type and return message component.
	 *
	 * @returns {Conversation Message Type Component}
	 */
	checkMessageType = () => {
		const { data: { type }} = this.props;

		switch (type) {
			case 'system':
				return this.renderSystemMessage();

			case 'sticker':
				return this.renderStickerMessage();

			case 'file':
				return this.renderFileMessage();

		}
	};

	render() {
		return (
			<View style={[styles.container]}>
				{ this.checkMessageType() }
			</View>
		);
	}
}


export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Variables.transparent
	},
	item: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 12,
		alignItems: 'center',
		flexDirection: 'column',
		maxWidth: '100%'
	},
	detailsSections: {
    alignSelf: 'flex-end',
    overflow: 'hidden',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    marginHorizontal: 0,
    flexGrow: 0,
    paddingBottom: 5,
    flexShrink: 0,
    width: 'auto',
    alignItems: 'flex-end',
		flexDirection: 'row',
		alignContent: 'flex-end'
	},
	messageSection: {
		maxWidth: '85%',
		alignItems: 'flex-end',
		flexDirection: 'row',
		alignContent: 'flex-end',
	},
	messageText: {
    textAlign: 'left',
    flexGrow: 0,
    flexShrink: 1,
    width: 'auto',
		fontSize: 17,
    paddingTop: 8,
		paddingBottom: 5,
		color: Variables.black,
		fontFamily: Variables.baseFontRegular
	},
	message: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		borderRadius: 18
	},
	messageFrom: {
		borderColor: 'rgba(112,184,91,1))',
		borderWidth: 1,
		borderStyle: 'solid',
		backgroundColor: 'rgba(224,246,218,1)',
		alignItems: 'flex-end',
		alignContent: 'flex-end',
	},
	messageTo: {
		borderColor: 'rgba(182,186,191,1)',
		borderWidth: 1,
		borderStyle: 'solid',
		alignItems: 'flex-start',
		alignContent: 'flex-start',
		backgroundColor: Variables.white
	},
	date: {
		textAlign: 'right',
		fontFamily: Variables.baseFontRegular,
		fontSize: 12,
		color: Variables.darkGrayText
	},
	imageContainer: {
		height: 42,
		width: 45,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		borderRadius: 24
	},
	image: {
		height: 40,
		width: 40,
		borderRadius: 20
	},
	emptyAvatarSection: {
		height: 40,
		justifyContent: 'center',
		borderRadius: 20,
		width: 40,
		backgroundColor: Variables.lightGrayText,
		borderColor: Variables.lightGrayText,
		borderWidth: 1,
	},
	emptyAvatarText: {
		textAlign: 'center',
		borderRadius: 20,
		fontSize: 17,
		color: Variables.white
	},
	headerSection: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 8,
		backgroundColor: 'rgba(142,142,147,0.6)',
	},
	systemMessageText: {
		color: Variables.white,
		fontFamily: Variables.baseFontRegular,
		paddingHorizontal: 15,
		paddingVertical: 0,
		textAlign: 'center',
		overflow: 'hidden',
		fontSize: 16
	},
	customText: {
		color: Variables.primaryColor,
		textDecorationLine: 'underline',
	},
	hashTag: {
		color: Variables.primaryColor,
	},
	ogBlock: {
		paddingVertical: 5,
		borderLeftColor: Variables.baseGreenColor,
		borderLeftWidth: 3
	},
	ogSiteName: {
		fontSize: 14,
		color: Variables.baseGreenColor,
		fontFamily: Variables.baseFontSemiBold,
		paddingLeft: 8
	},
	ogSiteTitle: {
		fontSize: 16,
		color: Variables.black,
		fontFamily: Variables.baseFontSemiBold,
		paddingLeft: 8
	},
	ogSiteDescription: {
		fontSize: 14,
		color: Variables.black,
		fontFamily: Variables.baseFontRegular,
		paddingLeft: 8
	},
	ogSiteImage: {
		margin: 8,
		height: 160,
		width: 240,
		borderRadius: 0
	},
	lastMessageStatusIcon: {
		alignContent: 'flex-end',
		justifyContent: 'flex-end',
		alignSelf: 'center',
		paddingLeft: 5
	}
});


const select = (state) => ({
	user: getCurrent(state)
});

const mapDispatchToProps = (dispatch) => {
	return { dispatch };
};

export default connect(select, mapDispatchToProps)(MessageItem);
