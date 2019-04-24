/**
 * Created by ivan on 14.03.18.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Content, Spinner, Item, Input, List } from 'native-base';
import { StyleSheet, View, Text, Alert, FlatList, TouchableHighlight, TouchableOpacity, Image} from 'react-native';
import Variables from '../../constants/variables';
import CallLogItem from './components/call-item';
import { isCallsTabActive } from '../../selectors/navigation';
import { getCallHistory, refreshCallHistory } from '../../actions/call-log';
import { IconIcoMoon } from '../../components';
import { createCall } from '../../actions/call';


class Calls extends React.Component {
	constructor(props) {
		super(props);

		this.onRefresh = this.onRefresh.bind(this);
		this.onEndReached = this.onEndReached.bind(this);
	}

	async componentDidMount() {
		await this.props.getCallHistory(true, 1);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.isTabActive && nextProps.isTabActive)
			this.props.refreshCallHistory();
	}

	onCallBack = (item) => {
		const { pending } = this.props;
		const contact = item.to || item.from || {};

		if (contact.id && !pending) {
			this.props.createCall(contact, false);
		}
	};

	keyExtractor = (item, index) => 'call_log_' + index;

	renderEmptyCalls = () => {
		return (
			<View style={StyleSheet.flatten([styles.column])}>
				<View style={StyleSheet.flatten([styles.center])}>
					<Text style={styles.emptyTitle}>No calls yet</Text>
					<IconIcoMoon name={'phone-call'} size={90} color={Variables.black} />
					<Text style={StyleSheet.flatten([styles.emptyMsg, { marginTop: 40 }])}>No phone calls were done yet.
						Start calling your friends and you will see the history of your calls here</Text>
				</View>
			</View>
		);
	};

	renderFooter = () => {
		if (!this.props.loading) return null;
		return <Spinner size="small" color={Variables.primaryColor} />;
	};

	renderItem = (item) => {
		return <CallLogItem key={item.index} onPress={() => this.onCallBack(item.item)} item={item.item} />
	};

	onRefresh() {
		this.props.refreshCallHistory();
	}

	onEndReached = () => {
		const { page, allLoaded } = this.props;
		if (allLoaded)
			return;

		this.props.getCallHistory(true, page + 1);
	};

	renderFlatList = () => {
		const { calls, refreshing } = this.props;

		return (
			<List style={StyleSheet.flatten(styles.container)}>
				<FlatList
					data={calls}
					onEndReachedThreshold={0.5}
					refreshing={refreshing}
					onRefresh={this.onRefresh}
					renderItem={this.renderItem}
					onEndReached={this.onEndReached}
					keyExtractor={this.keyExtractor}
					ListHeaderComponent={this.renderSearch}
					ListFooterComponent={this.renderFooter}
				/>
			</List>
		);
	};

	render() {
		const isEmpty = (!this.props.calls.length && !this.props.loading);
		return isEmpty ? this.renderEmptyCalls() : this.renderFlatList();
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Variables.white
	},
	column: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Variables.white
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	searchHeader: {
		paddingBottom: 10,
		paddingHorizontal: 12
	},
	searchInput: {
		flex: 1,
		height: 36,
		fontSize: 13,
		padding: 0,
		borderColor: 'rgba(228,228,232,1)',
		borderWidth: 1,
		textAlign: 'center',
		color: 'rgba(142,142,147,1)',
		backgroundColor: 'rgba(228,228,232,1)',
		borderRadius: 5
	},
	title: {
		marginTop: 10,
		marginBottom: 10,
		fontFamily: Variables.baseFontSemiBold,
		color: Variables.black,
		fontSize: 30,
		width: '100%',
		textAlign: 'left'
	},
	emptyTitle: {
		marginBottom: 40,
		fontFamily: Variables.baseFontSemiBold,
		color: Variables.black,
		fontSize: 30,
		textAlign: 'center'
	},
	emptyMsg: {
		marginTop: 1,
		fontFamily: Variables.baseFontSemiBold,
		color: Variables.black,
		fontSize: 16,
		lineHeight: 16,
		flex: 0.3,
		flexWrap: 'wrap',
		textAlign: 'center',
		marginHorizontal: 20
	}
});

const select = (state) => ({
	calls: state.ui.callLog.list,
	page: state.ui.callLog.page,
	allLoaded: state.ui.callLog.allLoaded,
	loading: state.ui.callLog.loading,
	refreshing: state.ui.callLog.refreshing,
	pending: state.ui.call.pending,
	isTabActive: isCallsTabActive(state)
});

export default connect(select, { getCallHistory, refreshCallHistory, createCall })(Calls);
