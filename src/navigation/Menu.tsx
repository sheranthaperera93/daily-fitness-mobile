import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Popup, Root } from 'react-native-popup-confirm-toast'

import {
  useIsDrawerOpen,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import { createStackNavigator } from '@react-navigation/stack';

import Screens from './Screens';
import { Block, Text, Switch, Button, Image } from '../components';
import { useData, useTheme, useTranslation } from '../hooks';
import { Login, OtpVerify, Register } from '../screens';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const { colors } = useTheme();
  const isDrawerOpen = useIsDrawerOpen();
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{ scale: scale }],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { isDark, handleIsDark, handleUser } = useData();
  const [active, setActive] = useState('Home');
  const { assets, colors, gradients, sizes } = useTheme();
  const labelColor = colors.text;

  const handleNavigation = useCallback(
    (to) => {
      setActive(to);
      navigation.navigate(to);
    },
    [navigation, setActive],
  );

  // screen list for Drawer menu
  const screens = [
    { name: t('screens.home'), to: 'Home', icon: assets.home },
    { name: t('screens.workouts'), to: 'Workouts', icon: assets.components },
    // {name: t('screens.components'), to: 'Components', icon: assets.components},
    // {name: t('screens.articles'), to: 'Articles', icon: assets.document},
    // {name: t('screens.rental'), to: 'Pro', icon: assets.rental},
    { name: t('screens.profile'), to: 'Profile', icon: assets.profile },
    // {name: t('screens.settings'), to: 'Pro', icon: assets.settings},
    // {name: t('screens.register'), to: 'Register', icon: assets.register},
    // {name: t('screens.login'), to: 'Login', icon: assets.register},
    // {name: t('screens.extra'), to: 'Pro', icon: assets.extras},
  ];

  const handleLogout = useCallback(() => {
    Popup.show({
      type: 'confirm',
      title: 'Logout Confirmation!',
      textBody: 'Are you sure you want to logout?',
      buttonText: 'Confirm',
      confirmText: 'Cancel',
      callback: () => {
        Popup.hide();
        handleUser();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      },
      cancelCallback: () => {
        Popup.hide();
      },
    })
  }, [navigation]);

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{ paddingBottom: sizes.padding }}>
      <Block paddingHorizontal={sizes.padding} color={colors.background}>
        <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Image
            radius={0}
            width={33}
            height={33}
            color={colors.text}
            source={assets.logo}
            marginRight={sizes.sm}
          />
          <Block>
            <Text size={12} semibold>
              {t('app.name')}
            </Text>
            <Text size={12} semibold>
              {t('app.native')}
            </Text>
          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block row justify="space-between" marginTop={sizes.sm}>
          <Text color={labelColor}>{t('darkMode')}</Text>
          <Switch
            checked={isDark}
            onPress={(checked) => {
              handleIsDark(checked);
            }}
          />
        </Block>

        <Button
          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={() => { handleLogout() }}>
          <Block
            flex={0}
            radius={6}
            align="center"
            justify="center"
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.white}>
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.black}
              source={assets.arrow}
            />
          </Block>
          <Text p color={labelColor}>
            {t('logout')}
          </Text>
        </Button>
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {
  const { gradients, colors, } = useTheme();

  const MenuDrawer = () => {
    return (
      <Root>
        <Block gradient={gradients.dark}>
          <Drawer.Navigator
            drawerType="slide"
            overlayColor="transparent"
            sceneContainerStyle={{ backgroundColor: colors.background }}
            drawerContent={(props) => <DrawerContent {...props} />}
            initialRouteName="Home"
            drawerStyle={{
              flex: 1,
              width: '60%',
              borderRightWidth: 0,
              backgroundColor: colors.background,
            }}>
            <Drawer.Screen name="Screens" component={ScreensStack} />
          </Drawer.Navigator>
        </Block>
      </Root>
    )
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        component={MenuDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Welcome', headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: 'Welcome', headerShown: false }}
      />
      <Stack.Screen
        name="OTPVerify"
        component={OtpVerify}
        options={{ title: 'Verification', headerShown: false }}
      />
    </Stack.Navigator>
  )

};
