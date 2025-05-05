import { useProfileDataState } from '../../../atoms/profileData';
import { QuestionireWrapper } from '../../../components/questionaire/wrapper';
import { baseColors } from '../../../constants/colors';
import { LoggedInStackParamsList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RefObject, useLayoutEffect, useRef } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Div, Text } from 'react-native-magnus';

const singleItemWidth = 44;
const ageOneToHundred = Array.from({ length: 100 }).map((_, idx) => idx);

export function QuestionTwo({ navigation }: NativeStackScreenProps<LoggedInStackParamsList, 'questionTwo'>) {
  const flatListRef: RefObject<FlatList<any>> | null = useRef(null);
  const [profile, setProfile] = useProfileDataState();

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newValue = Math.floor((event.nativeEvent.contentOffset.x + 4 * singleItemWidth) / singleItemWidth);
    setProfile(prev => ({ ...prev, age: newValue }));
  };

  useLayoutEffect(() => {
    if (!flatListRef.current) return;
    flatListRef.current.scrollToOffset({
      animated: true,
      offset: profile.age * singleItemWidth,
    });
  }, []);

  return (
    <QuestionireWrapper index={2} title="How old are you?">
      <Div mb={20}></Div>

      <Div bg={baseColors.themeLight} rounded={8} w="100%" py={8} h={44}>
        <FlatList
          horizontal
          scrollEnabled
          ref={flatListRef}
          style={{ flex: 1 }}
          data={ageOneToHundred}
          onScroll={onScrollEndDrag}
          legacyImplementation={false}
          onScrollEndDrag={onScrollEndDrag}
          keyboardShouldPersistTaps="always"
          onMomentumScrollEnd={onScrollEndDrag}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.toString()}
          onMomentumScrollBegin={onScrollEndDrag}
          getItemLayout={(_, index) => ({
            index: index,
            length: singleItemWidth,
            offset: index * singleItemWidth,
          })}
          renderItem={data => (
            <Div w={singleItemWidth} alignSelf="center" flexDir="row">
              <Text fontSize={20} color={baseColors.white} fontWeight="400">
                {data.item}
              </Text>
            </Div>
          )}
        />

        <Div
          rounded={31}
          h={62}
          w={62}
          bg={baseColors.yellowPrimary + 58}
          position="absolute"
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          mt={-10}>
          <Div
            rounded={27}
            h={54}
            w={54}
            bg={baseColors.yellowPrimary}
            borderColor={baseColors.yellowPrimary + 70}
            borderWidth={5}
            alignItems="center"
            justifyContent="center">
            <Text color={baseColors.white} fontWeight="500" fontSize={18}>
              {profile.age}
            </Text>
          </Div>
        </Div>
        {/* <ListSlider
          value={age}
          multiplicity={1}
          decimalPlaces={0}
          maximumValue={110}
          initialPositionValue={age}
          onValueChange={(v: number) => setAge(v)}
          mainContainerStyle={{ height: 40, alignSelf: 'center', borderRadius: 5 }}
          thumb={
            <Div
              rounded={31}
              h={62}
              w={62}
              bg={baseColors.yellowPrimary + 58}
              alignItems="center"
              justifyContent="center"
              alignSelf="center"
              mt={-10}>
              <Div
                rounded={27}
                h={54}
                w={54}
                bg={baseColors.yellowPrimary}
                borderColor={baseColors.yellowPrimary + 70}
                borderWidth={5}
                alignItems="center"
                justifyContent="center">
                <Text color={baseColors.white} fontWeight="500" fontSize={18}>
                  {age}
                </Text>
              </Div>
            </Div>
          }
        /> */}
      </Div>
    </QuestionireWrapper>
  );
}
