import { hp, wp } from '../../../Utils/dimension';
import { Disease, useProfileDataState } from '../../../atoms/profileData';
import { IndexTop } from '../../../components/questionaire/indexTop';
import AppImages from '../../../constants/AppImages';
import { baseColors } from '../../../constants/colors';
import AppFonts from '../../../constants/fonts';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Question5({ navigation }) {
  const [profile, setProfile] = useProfileDataState();
  const [tempHealthIssues, setTempHealthIssues] = useState(profile.health_issues || []);

  const data = [
    'What’s your Biological Gender?',
    'How old are you?',
    'How Tall are you?',
    'What is your Current Weight?',
    'Do you have any health issues?',
    'How active you are?',
  ];

  const dataBtn = ['diabeted', 'cholesterol', 'injury', 'breathing-issue', 'none'];

  const handleSetDiseases = disease => {
    setTempHealthIssues(prevIssues => {
      const currentIssues = new Set(prevIssues);

      if (disease === 'none') {
        return ['none'];
      }
      currentIssues.delete('none');
      if (currentIssues.has(disease)) {
        currentIssues.delete(disease);
      } else {
        currentIssues.add(disease);
      }

      return currentIssues.size === 0 ? ['none'] : Array.from(currentIssues);
    });
  };

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      health_issues: tempHealthIssues,
    }));
    console.log('Saved Health Issues:', tempHealthIssues);
    navigation.navigate('Question6');
  };

  const SingleTab = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => handleSetDiseases(item)}
        style={[
          styles.btnMain,
          {
            backgroundColor: tempHealthIssues.includes(item) ? baseColors.theme : baseColors.white,
            borderRadius: 8,
            borderColor: baseColors.btn_disable,
            borderWidth: 1,
            width: wp(90),
          },
        ]}>
        <Text
          style={[
            styles.btntitle,
            {
              color: tempHealthIssues.includes(item) ? baseColors.white : baseColors.theme,
              textTransform: 'capitalize',
            },
          ]}>
          {index === 3 ? 'Breathing Issue' : index === 4 ? 'I Am Healthy' : item}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: baseColors.theme }}>
      <View style={styles.main}>
        <IndexTop index={5} max={6} />
        {/* Question Title */}
        <Text style={styles.title}>{'Do you have any health issues?'}</Text>
        <View style={{ flex: 1, overflow: 'hidden', width: '100%', alignItems: 'center'}}>
          <View style={styles.mainBtn}>
            {dataBtn.map((item, index) => {
              return <SingleTab key={index} index={index} item={item} />;
            })}

            {/* Save Button */}
            <Pressable style={styles.nextbtnOuter} onPress={handleSave}>
              <Text style={styles.select_Txt}>
                Select
                <Image source={AppImages.right} style={styles.arrow} />
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={{ flex: 0.15, paddingHorizontal: wp(4), backgroundColor: baseColors.white }}>
        <View style={styles.bottomInner}>
          <View style={styles.pagination}>
            {data.map((_, index) => (
              <></>
            ))}
          </View>

          {/* Skip Button */}
          {/* Skip Button */}
          <Pressable
            onPress={() => {
              setProfile(prev => ({
                ...prev,
                health_issues: tempHealthIssues.length > 0 ? tempHealthIssues : ['none'],
              }));
              console.log('After Skipping the Health Issue Profile Data', profile)
              navigation.navigate('Question6');
            }}
            style={styles.nextbtnOuters}>
            <Text style={styles.skipTxt}>
              Skip for now
              <Image source={AppImages.right} style={styles.arrow} />
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS == 'android' ? hp(12) : hp(7),
    backgroundColor: baseColors.white,
  },
  bottomInner: {
    width: '100%',
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: baseColors.white,
  },
  nextbtnOuter: {
    height: wp(9),
    width: wp(20),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: baseColors.themeLight,
    // alignItems: 'center'
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  select_Txt: {
    fontSize: wp(3.5),
    textAlign: 'center',
    color: baseColors.theme,
    fontWeight: '500',
    fontFamily: AppFonts.bold,
  },
  arrow: {
    height: wp(3),
    width: wp(3),
    maxHeight: 20,
    maxWidth: 20,
    tintColor: baseColors.themeLight,
    resizeMode: 'contain',
    marginTop: -5,
  },
  title: {
    fontSize: RFValue(20),
    textAlign: 'center',
    color: baseColors.black,
    // fontWeight: '700',
    fontFamily: AppFonts.extraBold,
    marginTop: hp(3),
  },
  mainBtn: {
    // flex: 1,
    paddingVertical: hp(1)
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  btnMain: {
    height: hp(6.5),
    height: 52,
    marginTop: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntitle: {
    fontFamily: AppFonts.bold,
    fontWeight: '500',
    color: baseColors.theme,
    fontSize: RFValue(11),
  },
  skipTxt: {
    fontSize: RFValue(12.5),
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    color: baseColors.theme,
    fontWeight: '600',
  },
});
