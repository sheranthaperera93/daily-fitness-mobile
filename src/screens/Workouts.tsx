import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/core';

import { useData, useTheme, useTranslation } from '../hooks/';
import { Block, Input, Product, Text, Workout, } from '../components/';

const Workouts = () => {
  const { t } = useTranslation();
  const { sizes, colors } = useTheme();
  const navigation = useNavigation();
  const { workouts, setWorkouts } = useData();

  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block>
      {/* Workouts */}
      <Block safe>
        <Block
          scroll
          paddingHorizontal={sizes.padding}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: sizes.l }}>
          <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
            {workouts?.map((workout, index) => (
              <Workout
                id={`workout-${workout.id}-${index}`}
                name={workout.name}
                category={workout.category}
                pictureUrl={workout.pictureUrl}
                type={workout.type}/>
            ))}
          </Block>
        </Block>
      </Block>
    </Block >
  );
};

export default Workouts;
