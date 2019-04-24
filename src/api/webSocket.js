/**
 * Created by ivan on 23.03.18.
 */
if (Object.defineProperty) { Object.defineProperty(window.navigator, '', { configurable: true, get: function() { return 'react-native'; }}) };

const IO = require('socket.io-client');
const CryptoJS = require('crypto-js');
const Sound = require('react-native-sound');


class WebSocketProvider {
	constructor() {
		if (!instance) {
			instance = this;
		}

		return instance;
	}

	static getInstance() {
		return instance;
	}

	connect(url, options) {
		return new Promise((resolve, reject) => {
			this.socket = IO(url, options);

			this.initEvents();
		});
	}

	initEncrypt() {
		const crypt = new JSEncrypt({ default_key_size: 512 });

		//send key
		this.socket.emit('key', JSON.stringify({ key: publicKey }));

		//generate new message token
		this.socket.on('message_token', (data) => {
			
		});

		//get new message
		this.socket.on('conversation_message', (data) => {
			
		});

		//socket event listener for file upload message
		this.socket.on('file_uploaded', (data) => {
			const messageFile = JSON.parse(data);
			store.dispatch(messageFileUploaded(messageFile));
		});

		//socket event listener for read message
		this.socket.on('read', (data) => {
			const message = JSON.parse(data);
			store.dispatch(updateMessageStatus(message));
		});
	}

	initEvents() {
		this.socket.on('disconnect', () => {
			store.dispatch({ type: actions.SOCKET_DISCONNECT });
		});

		//socket event listener for recive new call
		this.socket.on('call', (data) => { startOnCall(data); });

		//socket event listener for accept new call
		this.socket.on('call_accepted', (data) => {
			
		});

		//socket event listener for turn call video
		this.socket.on('video', (data) => {
			
		});

		//socket event listener for turn call audio
		this.socket.on('audio', (data) => {
			
		});
		
		//socket event listener for change user online status
		this.socket.on('online', (online) => {
		
		});


		this.initChatEvents(); //init socket events for chats functionality
	}

	/**
	 * @function initChatEvents - init on socket event for chat functionality
	 */
	initChatEvents = () => {
		//socket event listener for created new conversation
		this.socket.on('conversation_created', (data) => {
			this.playMessageSound();
			store.dispatch(onAddCreatedConversation(data ? JSON.parse(data) : {}));
		});

		//socket event listener for change conversation title
		this.socket.on('conversation_new_title', (data) => {
			store.dispatch(onChangeConversationTitle(data ? JSON.parse(data) : null));
		});

		//socket event listener for add new participant to exist conversation
		this.socket.on('new_participant', (data) => {
			this.playMessageSound();
			store.dispatch(onAddNewParticipantToConversation(data ? JSON.parse(data) : null));
			store.dispatch(getConversations(1, true));
		});

		//socket event listener for add current user to new conversation
		this.socket.on('you_added_to_conversation', (data) => {
			this.playMessageSound();
			store.dispatch(onAddUserToConversation(data ? JSON.parse(data) : null));
			store.dispatch(getConversations(1, true));
		});

		//socket event lister on removed participant from conversation
		this.socket.on('participant_removed', (data) => {
			store.dispatch(onRemoveParticipantFromConversation(data ? JSON.parse(data) : null));
			store.dispatch(getConversations(1, true));
		});

		//socket event lister on removed participant from conversation
		this.socket.on('you_removed_from_conversation', (data) => {
			store.dispatch(updateSelectedConversation(data ? JSON.parse(data) : null));
			store.dispatch(getConversations(1, true));
		});

		//socket event lister for update total unread count messages
		this.socket.on('unread_conversation_count', (data) => {
			const _data = data ? JSON.parse(data) : null;
			localPushService.updateUnreadConversationCount(_data && _data.total ? _data.total : 0);
		});

		//socket event lister for update og tags for url in conversation message
		this.socket.on('message_og_info', (data) => {
			const _data = data ? JSON.parse(data) : null;
			store.dispatch(updateMessageOgTags(_data));
		});

		//socket event lister call when user start typing text in conversation message
		let typingInterval;
		this.socket.on('start_typing', (data) => {
			const _data = data ? JSON.parse(data) : null;
			store.dispatch(showConversationTyping(_data));

			clearTimeout(typingInterval);
			typingInterval = setTimeout(() => {
				store.dispatch(hideConversationTyping(_data));
			}, 30000);
		});

		//socket event lister call when user finish typing text in conversation message
		this.socket.on('finish_typing', (data) => {
			const _data = data ? JSON.parse(data) : null;
			store.dispatch(hideConversationTyping(_data));
		});
	};

	/**
	 * @function playMessageSound - Play sound for new message
	 */
	playMessageSound() {
		
	}

	/**
	 * @function disconnect - call for disconnect socket
	 */
	async disconnect() {
		
	}
}

export default WebSocketProvider;
