import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  ActivityIndicator
} from 'react-native';
const LoadModal = props => {
  const {
    loading,
    ...attributes
  } = props;

let fillFunction = () => console.log('hiii');

return (
    <Modal
      visible={loading}
      onRequestClose={fillFunction()}>
      <View style={styles.container}>
        <ActivityIndicator animating={loading}/>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});

export default LoadModal;
