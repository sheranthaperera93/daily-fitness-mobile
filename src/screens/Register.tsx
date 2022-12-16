import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Toast from 'react-native-toast-message';
import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Checkbox, OverlaySpinner } from '../components/';
import { registerUser } from "../services/authentication";
import * as Google from 'expo-auth-session/providers/google';
import { googleUserInfo } from "../services/authentication";

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Register = () => {
  const { isDark, handleUser } = useData();
  const { t } = useTranslation();
  const [isLoading, setLoadingState] = useState(false);
  const navigation = useNavigation();
  const [_, __, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: '1047292934936-7d0n02vrd8ielmad8huiseu8r5bvcnd5.apps.googleusercontent.com',
    // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
  });

  const { assets, colors, gradients, sizes } = useTheme();

  // Validation for user registaration
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    agreed: false,
  });

  // User registration form
  const [registration, setRegistration] = useState<IRegistration>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreed: false,
  });

  // Handle form changes
  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({ ...state, ...value }));
    },
    [setRegistration],
  );

  // Handle signup function
  const handleSignUp = useCallback(async () => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
      setLoadingState(true);
      const { status, data } = await registerUser(registration.email, registration.firstName,
        registration.lastName, registration.password);
      setLoadingState(false);
      if (status === 'SUCCESS') {
        navigation.navigate("OTPVerify", { userId: data.user.id })
      } else {
        Toast.show({
          type: 'error',
          text1: data,
        });
      }
    }
  }, [isValid, registration]);

  // Handle google registration
  const handleGoogleLogin = useCallback(async () => {
    const response = await googlePromptAsync();
    setLoadingState(true);
    if (response.type === "success") {
      const { access_token } = response.params;
      const resp = await googleUserInfo(access_token, true) as { status: string, data: any, attribute: string };
      if (resp.status === 'SUCCESS') {
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
        navigation.reset({ index: 0, routes: [{ name: "Drawer" }] })
      } else {
        Toast.show({
          type: 'error',
          text1: resp.data
        });
      }
    }
    setLoadingState(false);
  }, [])

  // Form validations
  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      firstName: regex.name.test(registration.firstName),
      lastName: regex.name.test(registration.lastName),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <OverlaySpinner
        isActive={isLoading}
        textColor={isDark ? 'white' : 'black'}
        backgroundColor={isDark ? 'black' : 'white'}
        spinnerSize="large"
        id='RegisterIndicator'
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
              {t('register.title')}
            </Text>
          </Image>
        </Block>
        {/* register form */}
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
                {t('register.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                {/* <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
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
                  autoCapitalize="sentences"
                  marginBottom={sizes.m}
                  label={t('common.firstname')}
                  placeholder={t('common.firstnamePlaceholder')}
                  success={Boolean(registration.firstName && isValid.firstName)}
                  danger={Boolean(registration.firstName && !isValid.firstName)}
                  onChangeText={(value) => handleChange({ firstName: value })}
                />
                <Input
                  autoCapitalize="sentences"
                  marginBottom={sizes.m}
                  label={t('common.lastname')}
                  placeholder={t('common.lastnamePlaceholder')}
                  success={Boolean(registration.lastName && isValid.lastName)}
                  danger={Boolean(registration.lastName && !isValid.lastName)}
                  onChangeText={(value) => handleChange({ lastName: value })}
                />
                <Input
                  autoCapitalize="none"
                  autoComplete='email'
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder={t('common.emailPlaceholder')}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({ email: value })}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.password')}
                  placeholder={t('common.passwordPlaceholder')}
                  onChangeText={(value) => handleChange({ password: value })}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              {/* checkbox terms */}
              <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({ agreed: value })}
                />
                <Text paddingRight={sizes.s}>
                  {t('common.agree')}
                  <Text
                    semibold
                    onPress={() => {
                      Linking.openURL('https://www.google.com/search?q=terms%20of%20service');
                    }}>
                    {t('common.terms')}
                  </Text>
                </Text>
              </Block>
              <Button
                onPress={handleSignUp}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                disabled={Object.values(isValid).includes(false)}>
                <Text bold white transform="uppercase">
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

export default Register;
