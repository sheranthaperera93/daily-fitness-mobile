import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Articles, Home, Profile, Workouts } from '../screens';
import { useScreenOptions, useTranslation } from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const { t } = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: t('navigation.home') }}
      />

      <Stack.Screen
        name="Workouts"
        component={Workouts}
        options={{title: t('navigation.workouts')}}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{ title: t('navigation.articles') }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: t('navigation.profile') }}
      />
      
    </Stack.Navigator>
  );
};
