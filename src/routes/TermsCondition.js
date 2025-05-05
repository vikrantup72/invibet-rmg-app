import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BettingTopBar } from '../components/betting/topBar'
import WebView from 'react-native-webview'
import { baseColors } from '../constants/colors'

export default function TermsCondition() {
  return (
    <View style={{flex:1,backgroundColor:baseColors.white}} >
      <BettingTopBar title={'Terms & Conditions'} noIcons />
      <WebView source={{ uri: 'https://tychee.in/terms-and-condition' }} style={{ flex:1}} />
    </View>
  )
}

const styles = StyleSheet.create({})