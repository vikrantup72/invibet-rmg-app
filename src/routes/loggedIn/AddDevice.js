import { hp, wp } from "../../Utils/dimension";
import CustomBtn from "../../components/CustomBtn";
import AppImages from "../../constants/AppImages";
import { baseColors } from "../../constants/colors";
import AppFonts from "../../constants/fonts";
import { setAuthRedux } from "../../redux/Reducers/userData";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import RNInstalledAppChecker from "react-native-installed-app-checker";
const AddDevice = ({ navigation }) => {
  const dispatch = useDispatch();
  const [visibleApps, setVisibleApps] = useState([]);

  const fitnessApps = [
    {
      name: "Samsung Health",
      package: "com.sec.android.app.shealth",
      logo: "https://play-lh.googleusercontent.com/VBqNEAIh3FUDt3X2cG9ufmuTCUvqbZRU3p7_Ok3RSzjS7EaeZ_9wAtFozJcATJAYJw=w240-h480",
    },
    {
      name: "Google Fit",
      package: "com.google.android.apps.fitness",
      logo: "https://play-lh.googleusercontent.com/EM_KojD4d2VqlTYqE46o9gXWp3AVwPRHDAX-mXHdTAAD2-BYxJDsOpA_aYIFdPYyz_Q=w240-h480",
    },
    {
      name: "Fitbit",
      package: "com.fitbit.FitbitMobile",
      logo: "https://play-lh.googleusercontent.com/AlA_Nfip-iUpmtn2HdUEQMyy0M48ikZi7q78OSy3Ey3sLTPKUBRQeOnAzRqxkYZKfA=w240-h480",
    },
    {
      name: "WHOOP",
      package: "com.whoop.android",
      logo: "https://play-lh.googleusercontent.com/gkhn05yLSE3Oq8dufEjxE5Y6aQKcKfDDVRcoqOGl9zkxMdDgTyoXkDoV95hL2L1Vn9I=w240-h480",
    },
    {
      name: "Garmin Connect",
      package: "com.garmin.android.apps.connectmobile",
      logo: "https://play-lh.googleusercontent.com/OmWtbL6tbiZwQUl_nAi0Nw4KTV7PSTHHF1e5YqVkj_gCn9ffxw9G90DnEqpQ5wSHQQ=w240-h480",
    },
    {
      name: "Zepp (Amazfit)",
      package: "com.huami.watch.hmwatchmanager",
      logo: "https://play-lh.googleusercontent.com/Y7dsLj3Kq7lPtbbM0kkMa3K4bo5BFzRwE7qD8asx3dwYoF0Nv44ZmQbswAevUNaJjxM=w240-h480",
    },
  ];

  useEffect(() => {
    const checkInstalledApps = async () => {
      const results = await Promise.all(
        fitnessApps.map(async (app) => {
          const result = RNInstalledAppChecker.isAppInstalled(app.package);
          return result.isInstalled ? app : null;
        })
      );
      // setVisibleApps(results.filter(Boolean));
    };

    // checkInstalledApps();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={styles.ImgContainer}>
          <Image source={{ uri: item.logo }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.productName}>{item.name}</Text>
        </View>
      </View>
      <Pressable
        style={{
          // backgroundColor: "#452B50",
          backgroundColor: "gray",
          borderRadius: 4,
          paddingVertical: 8,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ color: "#eee", fontSize: 12 }}>Connect</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Setup Your Device</Text>
      </View>
      <FlatList
        data={fitnessApps}
        renderItem={renderItem}
        keyExtractor={(item) => item.package}
        contentContainerStyle={styles.productList}
        ItemSeparatorComponent={<View style={{ margin: 10 }} />}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      />
      <Text style={{ textAlign: "center" }}>
        Check and auto-connect with Health Connect (Google Fit or Samsung
        Health)
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: hp(3),
        }}
      >
        <CustomBtn
          btnName={"Continue"}
          textStyle={{
            color: baseColors.theme,
            fontFamily: AppFonts.bold,
            fontWeight: "600",
          }}
          btnStyle={{
            marginVertical: hp(1),
            backgroundColor: "transparent",
            borderColor: "transparent",
            borderWidth: 1,
            width: wp(80),
          }}
          icon_right={AppImages.arrow_right}
          imgStyle_right={{ width: wp(3.2), height: wp(3.2) }}
          onPress={() => {
            setTimeout(() => {
              dispatch(setAuthRedux(true));
              navigation.navigate("bettingTabs");
            }, 100);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp(1),
    paddingHorizontal: 16,
  },
  main: {
    flex: 1,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },
  title: {
    fontSize: RFValue(16),
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    fontWeight: "600",
    marginBottom: hp(2),
  },
  selectedButton: {
    backgroundColor: baseColors.theme,
  },
  filterText: {
    color: baseColors.theme,
    fontSize: RFValue(14),
    fontWeight: "600",
    fontFamily: AppFonts.medium,
  },
  selectedText: {
    color: baseColors.white,
  },
  productList: {
    paddingBottom: hp(3),
  },
  card: {
    backgroundColor: "#FAF7FC",
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ImgContainer: {
    paddingVertical: wp(3),
  },
  image: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    marginRight: wp(2),
    resizeMode: "contain",
    backgroundColor: "#ddd",
  },
  textContainer: {
    flex: 1,
    paddingVertical: wp(3),
  },
  btn_Container: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    alignSelf: "flex-end",
  },
  Btn: {
    color: baseColors.theme,
    fontSize: RFValue(10),
    fontFamily: AppFonts.semibold,
    backgroundColor: baseColors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: 8,
  },
  productName: {
    fontSize: RFValue(13),
    color: baseColors.black,
    fontFamily: AppFonts.bold,
  },
  category: {
    fontSize: RFValue(11.5),
    color: baseColors.gray,
    fontFamily: AppFonts.regular,
  },
  arrow: {
    height: wp(3),
    width: wp(3),
    maxHeight: 20,
    maxWidth: 20,
    tintColor: baseColors.themeLight,
    resizeMode: "contain",
    marginTop: -5,
  },
});
