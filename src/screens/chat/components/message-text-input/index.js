/**
 * Created by ivan on 03.07.18.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TextInput, StyleSheet } from 'react-native';
import Variables from '../../../../constants/variables';


export default class MessageTextInput extends React.Component {

	static propTypes = {
		text: PropTypes.string.isRequired,
		onChangeText: PropTypes.func.isRequired,
		maxInputHeight: PropTypes.number.isRequired
	};

	static defaultProps = {
		defaultHeight: 35,
		maxInputHeight: 150
	};

	constructor (props) {
		super(props);

		this.state = { height: this.props.defaultHeight };
	}

	updateSize = (height) => {
		this.setState({ height });
	};

	onChangeText = (text) => {
		this.props.onChangeText(text);
	};

	onFocus = () => {
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	};

	render () {
		const { text } = this.props;
		const { height } = this.state;
		const newStyle = { height: Math.min(this.props.maxInputHeight, height < 35 ? 35 : height)};

		return (
			<View style={styles.viewInput}>
				<TextInput
					ref={(el) => this.ref = el }
					value={text}
					editable={true}
					multiline={true}
					autoFocus={false}
					autoCorrect={true}
					secureTextEntry={false}
					placeholder='Type something'
					onChangeText={this.onChangeText}
					onFocus={this.onFocus}
					underlineColorAndroid={'transparent'}
					placeholderTextColor={Variables.lightGrayText}
					style={[StyleSheet.flatten(styles.input), newStyle]}
					onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
				/>
			</View>
		)
	}
};


const styles = StyleSheet.create({
	viewInput: {
		flex: 1,
		width: '100%',
		borderColor: 'rgba(182,186,191,1)',
		paddingVertical: 0,
		paddingHorizontal: 12,
		borderWidth: 1,
		backgroundColor: Variables.white,
		borderRadius: 20,
		overflow: 'hidden'
	},
	input: {
		fontSize: 16,
		...Platform.select({
		  ios: { paddingTop: 7, paddingBottom: 6 },
		  android: { paddingVertical: 8 }
		}),
		width: '100%',
		textAlign: 'left',
		color: Variables.black,
		backgroundColor: Variables.white,
	}
});
