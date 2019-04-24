/**
 * Created by ivan on 27.05.18.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'native-base';
import { AppState,Animated, ScrollView, Dimensions, Image, TouchableWithoutFeedback, SectionList, Platform, Keyboard, StyleSheet, View, Text, ImageBackground, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Variables from '../../constants/variables';
import { ChatNavigationBar } from '../../components';
import StickerPanel from './components/sticker-panel';
import MessageFileChooser from './components/message-file-chooser';
import MessageItem from './components/message-item';
import MessageTextInput from './components/message-text-input';
import { getCurrentConversation, getSectionConversationMessages } from '../../selectors/chat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { sendConversationMessage, selectConversation, getConversationMessages, setMessagesAsRead } from '../../actions/chat';
import { conversationTyping } from '../../actions/talks';
import { getCurrent } from '../../selectors/users';
import { AnimatedHideView } from '../../components';
import R from 'ramda';
import { isIphoneX } from 'react-native-iphone-x-helper';
import * as localPushService from './../../services/local-push-notification';
import { getTypingUsers } from "../../selectors/talks";
import { selectors as stickersSelector } from "../../store/modules/stickers";
import FileChooserActionSheet from '../../components/file-chooser-action-sheet';

let clearInterval = 2000; //0.9 seconds
let clearTimerId;


class Chat extends React.Component {

	constructor(props) {
		super(props);

		this.messageList = null;
		this.endTypingTimer = null;
		this.state = {
			isTyping: false,
			text: '',
			appState: AppState.currentState,
			isShowStickerPanel: false,
		};
	}

	componentDidMount() {
		const { conversation } = this.props;

		this.props.navigation.setParams({
			title: conversation.title || '',
			isDialog: (typeof conversation.isDialog !== 'undefined' ? conversation.isDialog : true),
			onBackTap: this.onBackTap.bind(this),
			onEditTap: this.onEditTab.bind(this),
			conversation: conversation
		});

		this.props.getConversationMessages(1);

		AppState.addEventListener('change', this._handleAppStateChange);
		localPushService.cancelNotification(conversation.id);
	}

	onBackTap() {
		this.props.navigation.goBack();
	}

	onEditTab() {
		this.props.navigation.navigate({ key: 'EditTalk', routeName: 'EditTalk' });
	}

	onSendMessage = () => {
		let text = this.state.text;
		this.setState({ text: '', isTyping: false });

		this.props.sendConversationMessage(text);
		this.props.conversationTyping(false);
	};

	keyExtractor = (item, index) => item.id;

	renderItem = (item) => {
		const { conversation, stickerBaseUrl } = this.props;
		return <MessageItem stickerBaseUrl={stickerBaseUrl} conversation={conversation} data={item.item} isDialog={conversation.isDialog} />
	};

	onEndReached = () => {
		const { page, allLoaded, loading } = this.props;

		if (allLoaded || loading)
			return;

		this.props.getConversationMessages(page + 1);
	};

	renderSpinner = () => {
		if (!this.props.loading) return null;
		return <Spinner size="small" color={Variables.primaryColor} />;
	};

	onChangeText = (text) => {
		this.setState({ text });

		if (!this.state.isTyping) {
			this.props.conversationTyping();
			this.setState({ isTyping: true });
		}

		clearTimeout(this.endTypingTimer);
		this.endTypingTimer = setTimeout(() => { this.setState({ isTyping: false }); this.props.conversationTyping(false); }, 3000);
	};

	renderSection = ({ section }) => {
		return (
			<View style={StyleSheet.flatten(styles.headerSection)}>
				<Text style={StyleSheet.flatten(section.isNew ? styles.newMessagesHeader : styles.dateHeader)}>
					{section.key}
				</Text>
			</View>
		)
	};

	renderMessageList = () => {
		const { messages } = this.props;

		return(
			<View style={styles.listSection}>
				<SectionList
					ref={ref => this.messageList = ref}
					sections={messages}
					renderSectionFooter={this.renderSection}
					inverted={true}
					automaticallyAdjustContentInsets={false}
					keyExtractor={this.keyExtractor}
					onEndReachedThreshold={0.5}
					onEndReached={this.onEndReached}
					renderItem={this.renderItem}
					ListFooterComponent={this.renderSpinner}
				/>
			</View>
		);
	};

	toggleStickerPanel = () => {
		const isShowStickerPanel = !this.state.isShowStickerPanel;

		this.setState({ isShowStickerPanel }, () => {
			if (isShowStickerPanel) {
				Keyboard.dismiss();

				setTimeout(() => {
					if (this.stickerPanel) { this.stickerPanel.getWrappedInstance().togglePanel(true, true); }
				}, 100);
			} else {
				if (this.stickerPanel) { this.stickerPanel.getWrappedInstance().togglePanel(false, true); }
				this.textInput.ref.focus();
			}
		});
	};

	dismissStickerPanel = (isDismiss = false) => {
		if (this.state.isShowStickerPanel) {
			this.setState({ isShowStickerPanel: false }, () => {
				if (isDismiss) { Keyboard.dismiss(); }
				if (this.stickerPanel) { this.stickerPanel.getWrappedInstance().togglePanel(false, true); }
			});
		}
	};

	inputOnFocus = () => {
		this.dismissStickerPanel();
	};

	renderBottomToolbar = () => {
		const { isShowStickerPanel } = this.state;
		return (
			<View style={styles.bottomToolbarContainer}>
				<View style={styles.bottomToolbar}>
					<MessageFileChooser />
					<AnimatedHideView unmountOnHide={true} visible={!this.state.text}>
						<TouchableOpacity onPress={() => { this.toggleStickerPanel(); }} disable={!this.state.text} style={StyleSheet.flatten(styles.stickerIcon)}>
							<Ionicons name={isShowStickerPanel ? 'ios-keypad' : 'md-happy'} size={37} color={Variables.darkGrayText} />
						</TouchableOpacity>
					</AnimatedHideView>
					<MessageTextInput ref={(el) => this.textInput = el } onFocus={this.inputOnFocus} onChangeText={this.onChangeText} text={this.state.text} />
					<AnimatedHideView unmountOnHide={true} visible={!!this.state.text}>
						<TouchableOpacity onPress={this.onSendMessage} disable={!this.state.text} style={StyleSheet.flatten(styles.sendIcon)}>
							<Ionicons name={'md-arrow-up'} size={24} color={Variables.white} />
						</TouchableOpacity>
					</AnimatedHideView>
				</View>
				<StickerPanel ref={(el) => this.stickerPanel = el} />
			</View>
		);
	};

	outsideClick = () => {
		this.dismissStickerPanel(true);
	};

	render() {
		let keyboardOffset = (Platform.OS === 'ios' ? 64 : -500);

		if (isIphoneX()) {
		  keyboardOffset = keyboardOffset + 20;
		}

		return (
			<TouchableWithoutFeedback onPress={() => { this.outsideClick(); }}>
				<View style={{flex: 1}}>
					<KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={keyboardOffset}>
						<ImageBackground  style={styles.background} source={require('../../assets/images/chat_bg.png')}>
							{ this.renderMessageList() }
							{ this.renderBottomToolbar() }
						</ImageBackground>
					</KeyboardAvoidingView>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

Chat.navigationOptions = ChatNavigationBar;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Variables.lightGray
	},
	containerStyle: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	background: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: '100%'
	},
	listSection: {
		flex: 1,
		width: '100%',
		backgroundColor: 'transparent'
	},
	sendIcon: {
		marginLeft: 12,
		//marginVertical: 5,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: 40,
		borderRadius: 20,
		backgroundColor: Variables.primaryColor
	},
	stickerIcon: {
		marginRight: 5,
		//marginVertical: 5,
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: 40,
		borderRadius: 8,
		//backgroundColor: '#DDDDDD'
	},
	stickersPreviewContainer: {
		height: 60,
		backgroundColor: Variables.lightGray,
		borderBottomWidth: 0.5,
		borderBottomColor: 'rgba(182,186,191,1)',
	},
	stickersPreviewInnerContainer: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12
	},
	bottomToolbarContainer: {
		backgroundColor: Variables.lightGray,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%'
	},
	bottomToolbar: {
		borderTopColor: 'rgba(182,186,191,1)',
		borderTopWidth: 0.5,
		backgroundColor: Variables.lightGray,
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	viewInput: {
		flex: 1,
	//	height: 35,
		marginHorizontal: 10,
		paddingVertical: 0,
		paddingHorizontal: 12,
		borderColor: 'rgba(182,186,191,1)',
		borderWidth: 1,
		backgroundColor: Variables.white,
		borderRadius: 20,
		overflow: 'hidden'
	},
	input: {
		flex: 1,
		fontSize: 15,
		marginTop: 0,
		paddingBottom: 5,
		textAlign: 'left',
		color: 'rgba(142,142,147,1)',
		backgroundColor: Variables.white,
	},
	headerSection: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		paddingVertical: 15,
		borderRadius: 12,
		backgroundColor: Variables.transparent
	},
	dateHeader: {
		borderColor: 'rgba(182,186,191,1)',
		borderWidth: 1,
		borderStyle: 'solid',
		backgroundColor: Variables.white,
		fontFamily: Variables.baseFontRegular,
		paddingHorizontal: 15,
		paddingVertical: 0,
		borderRadius: 12,
		textAlign: 'center',
		overflow: 'hidden',
		fontSize: 16
	},
	newMessagesHeader: {
		color: 'rgba(182,186,191,1)',
		borderColor: 'rgba(182,186,191,1)',
		borderWidth: 1,
		borderStyle: 'solid',
		backgroundColor: Variables.white,
		flex: 1,
		paddingVertical: 2,
		fontFamily: Variables.baseFontRegular,
		textAlign: 'center',
		fontSize: 16
	}
});


const select = (state, props) => ({
	user: getCurrent(state),
	loading: state.ui.chat.loading,
	messages: getSectionConversationMessages(state),
	page: state.ui.chat.page,
	allLoaded: state.ui.chat.allLoaded,
	conversation: getCurrentConversation(state),
	typing: getTypingUsers(state, props),
	stickerBaseUrl: stickersSelector.getStickerBaseUrl(state),
});

export default connect(select, {
	conversationTyping,
	sendConversationMessage,
	getConversationMessages,
	selectConversation,
	setMessagesAsRead
})(Chat);
