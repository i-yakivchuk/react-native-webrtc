/**
 * Created by ivan on 04.04.18.
 */
import { AppRegistry } from 'react-native';
import App from './App';

if (!window.navigator.userAgent) {
	window.navigator.userAgent = "react-native";
}

AppRegistry.registerComponent('', () => App);
