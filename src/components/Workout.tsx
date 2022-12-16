import React from 'react';
import { TouchableOpacity } from 'react-native';

import Block from './Block';
import Image from './Image';
import Text from './Text';
import { IWorkout } from '../constants/types';
import { useTheme, useTranslation } from '../hooks/';

const Workout = ({ id, name, type, category, pictureUrl }: IWorkout) => {
    const { t } = useTranslation();
    const { assets, colors, sizes } = useTheme();

    const isHorizontal = type !== 'vertical';
    const CARD_WIDTH = (sizes.width - sizes.padding * 2 - sizes.sm) / 2;

    return (
        <Block
            key={id}
            card
            flex={0}
            row={isHorizontal}
            marginBottom={sizes.sm}
            width={isHorizontal ? CARD_WIDTH * 2 + sizes.sm : CARD_WIDTH}>
            <Image
                resizeMode="cover"
                source={{ uri: pictureUrl }}
                style={{
                    height: isHorizontal ? 114 : 110,
                    width: !isHorizontal ? '100%' : sizes.width / 2.435,
                }}
            />
            <Block
                paddingTop={sizes.s}
                justify="space-between"
                paddingLeft={isHorizontal ? sizes.sm : 0}
                paddingBottom={isHorizontal ? sizes.s : 0}>
                <Text p marginBottom={sizes.s}>
                    {name}
                </Text>
                <Text
                    p
                    marginBottom={sizes.s}
                    color={colors.secondary}
                    size={sizes.sm}>
                    {category}
                </Text>
                <TouchableOpacity>
                    <Block row flex={0} align="center">
                        <Text
                            p
                            color={colors.link}
                            semibold
                            size={sizes.linkSize}
                            marginRight={sizes.s}>
                            asdadasd
                        </Text>
                        <Image source={assets.arrow} color={colors.link} />
                    </Block>
                </TouchableOpacity>
            </Block>
        </Block>
    );
};

export default Workout;
