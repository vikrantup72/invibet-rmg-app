import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../Utils/dimension'; // Assuming these are utility functions for responsive design
import { baseColors } from '../constants/colors'; // Assuming colors constants
import AppImages from '../constants/AppImages'; // Assuming image imports
import AppFonts from '../constants/fonts';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ActiveBetComp(props) {
    const Block = ({ icon, title, subtitle }) => {
        return (
            <View style={styles.blockmain} >
                <Image source={icon} resizeMethod='contain' style={styles.calender} />
                <Text style={styles.steps} >{title ?? ''}</Text>
                <Text style={styles.subtitle} >{subtitle}</Text>
            </View>
        )
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: baseColors?.backgroundBets,
                paddingVertical: hp(2),
                flexDirection: 'row',
                borderRadius: 4,
                overflow: 'hidden',
                marginTop: hp(1)
            }}
        >
            {/* First view */}
            <View style={styles.firstView}>
                <View style={styles.iconContainer}>
                    {props?.calories > 0 && props?.steps > 0 ? (
                        //combined Icon
                        <View style={styles.iconWrapper}>
                            <Image source={AppImages.dis_and_steps} style={styles.icon} />
                            <Text style={styles.title}>{props?.calories} Cal</Text>
                            <Text style={styles.title}>{props?.steps} Steps</Text>
                        </View>
                    ) : (
                        //individual~icon
                        <>
                            {props?.calories > 0 && (
                                <View style={styles.iconWrapper}>
                                    <Image source={AppImages.calories} style={styles.icon} />
                                    <Text style={styles.title}>{props?.calories} Cal</Text>
                                </View>
                            )}
                            {props?.steps > 0 && (
                                <View style={styles.iconWrapper}>
                                    <Image source={AppImages.walk} style={styles.icon} />
                                    <Text style={styles.title}>{props?.steps} Steps</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>

            {/* Third view */}
            <View style={styles.thirdView}>
                <Block icon={AppImages.pay} title={`PTs ${props.put_points ?? '0'}`} subtitle={'You Give'} />
            </View>

            {/* Fourth view */}
            <View style={styles.fourthView}>
                <Block icon={AppImages.payout} title={`PTs ${props.get_points ?? '0'}`} subtitle={'You Get'} />
            </View>

            {/* Fifth view */}
            <View style={styles.fifthView}>
                <View style={{ height: '100%', width: '100%', alignItems: 'flex-end', justifyContent: 'center' }} >
                    <AnimatedCircularProgress
                        size={62}
                        width={14}
                        fill={25} // 20% progress
                        tintColor="#fbbd5d"
                        backgroundColor="#fcdab1"
                        arcSweepAngle={360} // Semi-circle
                        rotation={0} // Start from top
                        lineCap="round"
                    >
                        {(fill) => (
                            <View style={styles.textContainer}>
                                <Text style={styles.progressText}>25k</Text>
                                <Text style={styles.totalText}>/100k</Text>
                            </View>
                        )}
                    </AnimatedCircularProgress>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    firstView: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(1),
        borderRightWidth: 1,
        borderColor: baseColors.theme,
    },
    secondView: {
        flex: 1,
        paddingHorizontal: wp(1),
    },
    thirdView: {
        flex: 0.8,
        paddingHorizontal: wp(1),
    },
    fourthView: {
        flex: 0.8,
        paddingHorizontal: wp(1),
        borderRightWidth: 1,
        borderRightColor: baseColors.theme
    },
    fifthView: {
        flex: 1,
        paddingHorizontal: wp(1),
    },
    iconContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: wp(10),
        width: wp(10),
        alignSelf: 'center',
        resizeMode: "contain"
    },
    title: {
        fontSize: 8,
        textAlign: 'center',
        color: baseColors.theme,
        fontFamily: AppFonts.medium,
        fontWeight: '700'
    },
    blockmain: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    calender: {
        height: wp(6),
        width: wp(6),
        resizeMode: "contain",
        tintColor: baseColors.theme
    },
    steps: {
        fontSize: 9,
        textAlign: 'center',
        color: baseColors.theme,
        fontFamily: AppFonts.bold,
        fontWeight: '700',
        marginTop: 4
    },
    subtitle: {
        fontSize: 9,
        textAlign: 'center',
        color: baseColors.betSubtitile,
        fontFamily: AppFonts.light,
        fontWeight: '700',
    },
    textContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '700',
        fontFamily: AppFonts.semibold,
        color: '#4c3c61',
    },
    totalText: {
        fontSize: 8,
        fontWeight: '700',
        fontFamily: AppFonts.semibold,
        color: '#fbbd5d',
        marginTop: -2
    },
});
