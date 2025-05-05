import { baseColors } from '../constants/colors';
import { memo } from 'react';
import { View } from 'react-native';
import { Div, Text } from 'react-native-magnus';

export type ItemProps = { opacity: number; selected: boolean; fontSize: number; name: string };
export const Item = memo(({ fontSize, name, opacity, selected }: ItemProps) => {
  return (
    <Div justifyContent='space-around' alignItems="center" h={48} rounded={10} opacity={opacity} w={190}>
      <Text
        fontSize={fontSize}
        borderBottomWidth={1}
        borderBottomColor={baseColors.borderBottom_smt}
        fontWeight={selected ? '700' : '500'}
        color={selected ? baseColors.theme : baseColors.btn_disable}>
        {name}
      </Text>
      <View style={{height:0.8,width:'60%',backgroundColor:'rgba(255,255,255,0.3)'}} />
    </Div>
  );
});

export const opacities = [1, 1, 0.4, 0.1, 0.1];
export const sizeText = [32, 25, 20];

export type ItemToRenderProps = { item: any; index: number; selectedIndex: any };
export const ItemToRender = memo(({ item, index, selectedIndex }: ItemToRenderProps) => {
  const gap = Math.abs(index - selectedIndex);
  return (
    <>
    <Item
      name={item}
      selected={index === selectedIndex}
      fontSize={gap > 1 ? sizeText[2] : sizeText[gap]}
      opacity={gap > 3 ? opacities[4] : opacities[gap]}
    />
    </>
  );
});
