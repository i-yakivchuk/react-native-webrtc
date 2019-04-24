/**
 * Created by ivan on 16.03.18.
 */
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/**
 * Render component for scroll keyboard wrapper.
 */
export function ScrollKeyboardContent(props) {
	return (
		<KeyboardAwareScrollView {...props} contentContainerStyle={{paddingBottom: -50}} extraScrollHeight={50}>
			{props.children}
		</KeyboardAwareScrollView>
	)
};
