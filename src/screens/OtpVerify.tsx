import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Image, Text, OverlaySpinner } from '../components';
import { verifyUser } from "../services/authentication";
import Toast from 'react-native-toast-message';
import OTPInputView from '@twotalltotems/react-native-otp-input'

const isAndroid = Platform.OS === 'android';

interface IOtpVerify {
    code: string;
    userId: string
}

const OtpVerify = (params: any) => {
    const { isDark, handleUser } = useData();
    const { t } = useTranslation();
    const [otpVerify, setOtpVerify] = useState<IOtpVerify>({
        code: "",
        userId: params.route.params.userId
    });
    const { assets, colors, gradients, sizes } = useTheme();
    const [isLoading, setLoadingState] = useState(false);
    const navigation = useNavigation();

    // Handle form value changes
    const handleChange = useCallback(
        (value) => {
            setOtpVerify((state) => ({ ...state, ...value }));
        }, [setOtpVerify],
    );

    // Handle OTP verification
    const handleOtpVerify = useCallback(async () => {
        setLoadingState(true);
        const resp = await verifyUser(otpVerify.userId, otpVerify.code);
        if (resp.status === "SUCCESS") {
            setLoadingState(false);
            handleUser({
                id: resp.data.user.id,
                name: resp.data.user.name,
                avatar: resp.data.user.pictureUrl,
                type: resp.data.user.type,
                role: resp.data.user.role,
                firstName: resp.data.user.firstName,
                lastName: resp.data.user.last_name,
                isEmailVerified: resp.data.user.isEmailVerified,
                accessToken: resp.data.tokens.access.token,
                refreshToken: resp.data.tokens.refresh.token
            });
        } else {
            setLoadingState(false);
            Toast.show({
                type: 'error',
                text1: resp.data
            });
        }
    }, [otpVerify]);

    return (
        <Block safe marginTop={sizes.md}>
            <OverlaySpinner
                isActive={isLoading}
                textColor={isDark ? 'white' : 'black'}
                backgroundColor={isDark ? 'black' : 'white'}
                spinnerSize="large"
                id='VerifyOtpIndicator'
                text='Loading...'
            />
            <Block paddingHorizontal={sizes.s}>
                <Block flex={0} style={{ zIndex: 0 }}>
                    <Image
                        background
                        resizeMode="cover"
                        padding={sizes.sm}
                        radius={sizes.cardRadius}
                        source={assets.background}
                        height={sizes.height * 0.3}>
                        <Button
                            row
                            flex={0}
                            justify="flex-start"
                            onPress={() => navigation.goBack()}>
                            <Image
                                radius={0}
                                width={10}
                                height={18}
                                color={colors.white}
                                source={assets.arrow}
                                transform={[{ rotate: '180deg' }]}
                            />
                            <Text p white marginLeft={sizes.s}>
                                {t('common.goBack')}
                            </Text>
                        </Button>

                        <Text h4 center white marginBottom={sizes.md}>
                            {t('otpVerify.title')}
                        </Text>
                    </Image>
                </Block>
                {/* Verify form */}
                <Block
                    keyboard
                    behavior={!isAndroid ? 'padding' : 'height'}
                    marginTop={-(sizes.height * 0.2 - sizes.l)}>
                    <Block
                        flex={0}
                        radius={sizes.sm}
                        marginHorizontal="8%"
                        shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
                    >
                        <Block
                            blur
                            flex={0}
                            intensity={90}
                            radius={sizes.sm}
                            overflow="hidden"
                            justify="space-evenly"
                            tint={colors.blurTint}
                            paddingVertical={sizes.m}>
                            <Text p semibold center>
                                {t('otpVerify.subtitle')}
                            </Text>
                            {/* form inputs */}
                            <Block paddingHorizontal={sizes.sm} paddingVertical={sizes.md}>
                                {/* <Input
                                    marginBottom={sizes.m}
                                    label={t('common.otpCode')}
                                    keyboardType="number-pad"
                                    placeholder={t('common.verifyOtpPlaceholder')}
                                    onChangeText={(value) => handleChange({ code: value })}
                                /> */}
                                <OTPInputView
                                    style={{ alignSelf: 'center', width: '80%', height: 100 }}
                                    pinCount={6}
                                    autoFocusOnLoad={true}
                                    codeInputFieldStyle={{
                                        width: 30,
                                        height: 45,
                                        borderWidth: 0,
                                        borderBottomWidth: 1,
                                    }}
                                    placeholderTextColor="#ffffff"
                                    codeInputHighlightStyle={{ borderColor: "#ffffff", color: colors.text }}
                                    onCodeFilled={(code => {
                                        handleChange({ code: code })
                                        handleOtpVerify();
                                    })}
                                />
                            </Block>
                            <Button
                                onPress={handleOtpVerify}
                                marginVertical={sizes.s}
                                marginHorizontal={sizes.sm}
                                gradient={gradients.primary}>
                                <Text bold white transform="uppercase">
                                    {t('common.verify')}
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </Block>
            <Toast position='top' />
        </Block>
    );
};

export default OtpVerify;
