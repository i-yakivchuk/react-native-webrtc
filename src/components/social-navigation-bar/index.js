/**
 * Created by ivan on 14.03.18.
 */
import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { Text, View, Button, Content } from 'native-base';
import { IconButton } from '../buttons';


export function SocialNavigationBar({ navigation }) {
	return ({
		headerLeft: <TouchableOpacity style={{ marginLeft: 10 }} onPress={null}><Text style={{ paddingTop: 10, fontSize: 18, paddingBottom: 10, paddingRight: 15, color: '#0A5CAA' }}>Edit</Text></TouchableOpacity>,
		headerRight: <IconButton size={26} name={'md-options'} onPress={null} />,
	});
};
