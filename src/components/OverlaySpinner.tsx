import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View, ViewStyle, ActivityIndicator } from 'react-native';

import useTheme from '../hooks/useTheme';
import { IActivityOverlaySpinner } from '../constants/types';

const OverlaySpinner = (props: IActivityOverlaySpinner) => {

    const { colors, sizes } = useTheme();

    const {
        id = 'OverlaySpiner',
        isActive = true,
        style,
        backgroundColor = 'black',
        spinnerColor = 'rgba(0,0,0,0.25)',
        spinnerSize = 'large',
        text = 'Loading...',
        textColor = colors.text,
        ...rest
    } = props;

    const indicatorColor = spinnerColor === 'black' ? '#000000' : '#ffffff';
    const bgColor = backgroundColor === 'black' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';

    // generate component testID or accessibilityLabel based on Platform.OS
    const overlaySpinnerID =
        Platform.OS === 'android' ? { accessibilityLabel: id } : { testID: id };

    const overlaySpinnerStyles = StyleSheet.flatten([
        style,
        {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 12,
            ...(backgroundColor && { backgroundColor: bgColor }),
        },
    ]);

    if (isActive) {
        return (<View {...overlaySpinnerID} {...rest} style={overlaySpinnerStyles}>
            <ActivityIndicator size={spinnerSize} color={indicatorColor} />
            <Text style={{ color: textColor, fontSize: sizes.m, marginTop: 25 }}>{text}</Text>
        </View>)
    } else {
        return null;
    }

};

export default React.memo(OverlaySpinner);