import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BettingTopBar } from '../components/betting/topBar'
import WebView from 'react-native-webview'
import { baseColors } from '../constants/colors'

export default function HelpCenter() {
  return (
    <View style={{flex:1,backgroundColor:baseColors.white}} >
      <BettingTopBar title={'Tychee'} noIcons />
      <WebView source={{ uri: 'https://tychee.in' }} style={{ flex:1}} />
    </View>
  )
}

const styles = StyleSheet.create({})