import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { hp, wp } from '../Utils/dimension'; // Assuming these are utility functions for responsive design
import { Label } from './activity'; // Assuming this is a custom component
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { baseColors } from '../constants/colors'; // Assuming colors constants
import AppImages from '../constants/AppImages'; // Assuming image imports
import { AppConstant } from '../constants/AppConstants';
import AppFonts from '../constants/fonts';
import { Button } from 'react-native-magnus';

export default function SingleBetComp(props) {
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
            }}
        >
            {/* First view */}
            <View style={styles.firstView}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconRow}>
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
            </View>

            {/* Second view */}
            <View style={styles.secondView}>
                {/* <Block icon={AppImages.calender} title={`${props?.duration??'0'}/${props?.steps??'0'}`} subtitle={`Complete in ${props?.timeframe??''}`} /> */}
                <Block icon={AppImages.joinedUsers} title={`${props?.joined_users??'0'}`} subtitle={'Joined Users'}/>
            </View>

            {/* Third view */}
            <View style={styles.thirdView}>
                <Block icon={AppImages.pay} title={`PTs ${props.put_points??'0'}`} subtitle={'You Give'} />
            </View>

            {/* Fourth view */}
            <View style={styles.fourthView}>
                <Block icon={AppImages.payout} title={`PTs ${props.get_points??'0'}`} subtitle={'You Get'} />
            </View>

            {/* Fifth view */}
            <View style={styles.fifthView}>
                <View style={{height:'100%',width:'100%',alignItems:'flex-end',justifyContent:'center'}} >
                {props?.is_joined ? 
                <View style={{alignSelf:'flex-end'}} >
                <Button pt={2} pb={3} px={10} fontSize="xs" bg={'grey'}  >
                    Joined
                </Button>
                </View>
                    :<View style={{alignSelf:'flex-end'}} >
                     <Button pt={2} pb={3} px={11} fontSize="xs" bg={baseColors.theme} onPress={props.onPressJoin}>
                        Join
                    </Button>
                    </View>
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    firstView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(1),
        borderRightWidth: 1,
        borderColor: baseColors.theme
    },
    secondView: {
        flex: 1,
        paddingHorizontal: wp(1)
    },
    thirdView: {
        flex: 1,
        paddingHorizontal: wp(1)
    },
    fourthView: {
        flex: 1,
        paddingHorizontal: wp(1)
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
    iconRow: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        alignItems: 'center',
    },
    icon: {
        height: wp(10),
        width: wp(10),
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
});
