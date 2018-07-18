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

return (
    <Modal
      visible={loading}>
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
