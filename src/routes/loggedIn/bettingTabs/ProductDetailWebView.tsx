import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import WebView from 'react-native-webview'
import { baseColors } from '../../../constants/colors'
import { BettingTopBar } from '../../../components/betting/topBar'


export default function ProductDetailWebView(props) {
    const {link}=props?.route?.params
    console.log('props web view -=',props)
  return (
    <View style={{flex:1,backgroundColor:baseColors.white}} >
      <BettingTopBar title={'Tychee'} noIcons />
      <WebView source={{ uri:link}} style={{ flex:1}} />
    </View>
  )
}

const styles = StyleSheet.create({})