import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Input, Image, Text, OverlaySpinner } from '../components';
import * as Google from 'expo-auth-session/providers/google';
import { googleUserInfo, loginUser } from "../services/authentication";
import Toast from 'react-native-toast-message';

const isAndroid = Platform.OS === 'android';

interface ILogin {
  email: string;
  password: string;
}

const Login = () => {
  const { isDark, handleUser } = useData();
  const { t } = useTranslation();
  const [login, setLogin] = useState<ILogin>({
    email: '',
    password: '',
  });
  const { assets, colors, gradients, sizes } = useTheme();
  const [isLoading, setLoadingState] = useState(false);
  const navigation = useNavigation();
  const [_, __, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: '1047292934936-7d0n02vrd8ielmad8huiseu8r5bvcnd5.apps.googleusercontent.com',
    // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
  });

  // Handle form changes 
  const handleChange = useCallback(
    (value) => {
      setLogin((state) => ({ ...state, ...value }));
    }, [setLogin],
  );

  // Handle email password login
  const handleSignIn = useCallback(async () => {
    setLoadingState(true);
    const { status, data } = await loginUser(login.email, login.password);
    if (status === 'SUCCESS') {
      handleUser({
        id: data.user.id,
        name: data.user.name,
        avatar: data.user.pictureUrl,
        type: data.user.type,
        role: data.user.role,
        firstName: data.user.firstName,
        lastName: data.user.last_name,
        isEmailVerified: data.user.isEmailVerified,
        accessToken: data.tokens.access.token,
        refreshToken: data.tokens.refresh.token
      });
      navigation.reset({index: 0, routes: [{name: "Drawer"}]})
    } else {
      Toast.show({
        type: 'error',
        text1: data
      });
    }
    setLoadingState(false);
  }, [login]);

  // Handle google registration
  const handleGoogleLogin = useCallback(async () => {
    const response = await googlePromptAsync();
    setLoadingState(true);
    if (response.type === "success") {
      const { access_token } = response.params;
      const { status, data } = await googleUserInfo(access_token, false);
      if (status === 'SUCCESS') {
        setLoadingState(false);
        handleUser({
          id: data.user.id,
          name: data.user.name,
          avatar: data.user.pictureUrl,
          type: data.user.type,
          role: data.user.role,
          firstName: data.user.firstName,
          lastName: data.user.last_name,
          isEmailVerified: data.user.isEmailVerified,
          accessToken: data.tokens.access.token,
          refreshToken: data.tokens.refresh.token
        });
        navigation.reset({index: 0, routes: [{name: "Drawer"}]})
      } else {
        setLoadingState(false);
        Toast.show({
          type: 'error',
          text1: data
        });
      }
    }
  }, [googlePromptAsync, navigation])

  return (
    <Block safe marginTop={sizes.md}>
      <OverlaySpinner
        isActive={isLoading}
        textColor={isDark ? 'white' : 'black'}
        backgroundColor={isDark ? 'black' : 'white'}
        spinnerSize="large"
        id='LoginIndicator'
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
            <Text h4 center white marginBottom={sizes.md}>
              {t('login.title')}
            </Text>
          </Image>
        </Block>
        {/* login form */}
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
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('login.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                {/* <Button outlined gray shadow={!isAndroid} onPress = {() => handleSocialLogin("facebook")}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid} onPress = {() => handleSocialLogin("apple")}>
                    <Image
                      source={assets.apple}
                      height={sizes.m}
                      width={sizes.m}
                      color={isDark ? colors.icon : undefined}
                    />
                </Button> */}
                <Button outlined gray shadow={!isAndroid} onPress={handleGoogleLogin}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  onChangeText={(value) => handleChange({ email: value })}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({ password: value })}
                />
              </Block>
              <Button
                onPress={handleSignIn}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                  {t('common.signin')}
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={() => navigation.navigate('Register')}>
                <Text bold primary transform="uppercase">
                  {t('common.signup')}
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

export default Login;
