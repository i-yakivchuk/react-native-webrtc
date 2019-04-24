import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { StyleProvider, Root } from 'native-base';
import store from './src/store/configureStore';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import Main from './src/screens/Main';



class App extends Component {

  render() {
    return this.state.appIsReady ? (
	    <Root>
	      <Provider store={store}>
	        <StyleProvider  style={getTheme(commonColor)}>
	          <View style={styles.container}>
	            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
	            {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
	            <Main callFromPush={this.state.call} />
	          </View>
	        </StyleProvider>
	      </Provider>
	    </Root>
    ): null;
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	containerView: {
		flex: 1,
	},
	statusBarUnderlay: {
		height: 0,
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
});

export default App;
