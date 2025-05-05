import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp, wp } from '../../Utils/dimension'
import { baseColors } from '../../constants/colors'
import AppFonts from '../../constants/fonts'
import { RFValue } from 'react-native-responsive-fontsize'
import FastImage from 'react-native-fast-image'
import AppImages from '../../constants/AppImages'
import CustomBtn from '../CustomBtn'
import LinearGradient from 'react-native-linear-gradient';

export default function NewVersionModal({ onCrossPress, onDownloadPress, versionData }) {
    const IconBlock = ({ icon, title }) => {
        return (
            <View style={styles.bottomIconMain} >
                <FastImage source={icon} resizeMode='contain' style={styles.bottomicon} />
                <Text style={styles.iconTitle} >{title ?? ''}</Text>
            </View>
        )
    }
    return (
        <Modal visible={true} transparent={true} >
            <View style={styles.darkView} >
                <View style={styles.whiteView} >
                    <Text style={styles.title} >Tychee</Text>
                    <Text style={[styles.title, { marginTop: hp(1) }]} >New Version </Text>
                    <Text style={styles.title} >Available!</Text>

                    <View style={styles.iconOuter} >
                        <FastImage source={AppImages.stars} resizeMode='contain' style={styles.stars} />
                        <FastImage source={AppImages.download} resizeMode='contain' style={styles.downloadIcon} />
                    </View>


                    <Text style={styles.description} >We've added new features, performance upgrades, and more ways to earn! Download the latest</Text>
                    <Text style={styles.description}>Tychee APK now.</Text>

                    <Pressable onPress={onDownloadPress} style={styles.buttonOuter} >
                        <LinearGradient colors={['#8eff73', '#b2ff5a']} style={styles.gradient}>
                            <Text
                                style={[styles.btnText]}
                            >
                                Download Now
                            </Text>
                        </LinearGradient>
                    </Pressable>

                    <View style={styles.bottomMain} >
                        <IconBlock title={'Faster App'} icon={AppImages.timer} />
                        <IconBlock title={'New Features'} icon={AppImages.bulb} />
                        <IconBlock title={'More Rewards'} icon={AppImages.rewards} />
                    </View>

                    <View>

                    </View>
                    {(versionData?.is_mandatory=='false') && <Pressable onPress={onCrossPress} style={styles.crossOuter} >
                        <FastImage source={AppImages.crossBg} resizeMode='contain' style={styles.cross} />
                    </Pressable>}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    darkView: {
        flex: 1,
        backgroundColor: baseColors.modalBgPurple,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(5)
    },
    whiteView: {
        width: "100%",
        paddingVertical: hp(2),
        backgroundColor: baseColors.modalBgLight,
        borderRadius: 10,
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: wp(8)
    },
    title: {
        fontFamily: AppFonts.extraBold,
        color: baseColors.white,
        fontSize: RFValue(20)
    },
    description: {
        fontFamily: AppFonts.regular,
        color: baseColors.white,
        fontSize: RFValue(14)
    },
    stars: {
        height: wp(15),
        width: wp(15),
        position: 'absolute',
        zIndex: 9999,
        left: 0,
        top: hp(-2)
    },
    downloadIcon: {
        height: wp(15),
        width: wp(15)
    },
    iconOuter: {
        marginVertical: hp(2),
        flexDirection: 'row',
        width: '70%',
        justifyContent: 'center',

    },
    bottomicon: {
        height: wp(9),
        width: wp(9)
    },
    bottomIconMain: {
        alignItems: 'center',
        width: '32%'
    },
    iconTitle: {
        fontFamily: AppFonts.medium,
        color: baseColors.white,
        fontSize: RFValue(9),
    },
    bottomMain: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    buttonOuter: {
        borderWidth: 1,
        width: '80%',
        height: 50,
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: hp(1.5),
        marginBottom: hp(1)
    },
    gradient: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        fontFamily: AppFonts.semibold,
        fontSize: RFValue(15),
        alignSelf: "center",
        color: baseColors.black,
        fontWeight: "700",
        textAlign: "center",
    },
    cross: {
        height: wp(7),
        width: wp(7)
    },
    crossOuter: {
        position: 'absolute',
        right: wp(3),
        top: wp(4)
    }

})