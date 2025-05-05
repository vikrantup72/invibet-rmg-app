import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { baseColors } from '../constants/colors';
import { hp, wp } from '../Utils/dimension';
import AppFonts from '../constants/fonts';

const { height } = Dimensions.get('window');

const BluetoothPromptModal = ({ visible, onClose, onSettings }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={styles.title}>
            Fitplay would like to use bluetooth for new connections.
            </Text>
            <Text style={styles.description}>
            You can allow new connections in settings.
            </Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSettings} style={styles.settingsButton}>
                <Text style={styles.settingsText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BluetoothPromptModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    height: hp(25),
    backgroundColor: baseColors.white,
    borderRadius: 50,
    paddingHorizontal: wp(10),
    width: wp(85),
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: RFValue(13),
    fontWeight: '600',
    color: baseColors.black,
    fontFamily: AppFonts.medium,
    marginBottom: 10,
  },
  description: {
    fontSize: RFValue(11),
    fontWeight: '400',
    fontFamily: AppFonts.medium,
    color: baseColors.gray,
    marginBottom: hp(2),
  },
  actions: {
    flexDirection: 'row',
  },
  closeButton: {
    flex: 1,
    alignItems: 'flex-end',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  closeText: {
    fontWeight: '600',
    fontSize: RFValue(11),
    color: baseColors.theme,
  },
  settingsButton: {
    alignItems: 'flex-end',
    marginLeft: wp(3)
  },
  settingsText: {
    fontSize: RFValue(11),
    fontWeight: '600',
    color: baseColors.theme,
  },
});
