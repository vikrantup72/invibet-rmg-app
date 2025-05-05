import React from 'react';
import { Modal, StyleSheet, View, Image, ModalProps } from 'react-native';
import AppImages from '../constants/AppImages';
import FastImage from 'react-native-fast-image';

interface LoaderProps extends ModalProps {

}

const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      {...props}
    >
      <View style={styles.modalScreen}>
        <FastImage
          resizeMode="contain"
          source={AppImages.loader}
          style={{ height: '30%', width: '30%' }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalScreen: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
