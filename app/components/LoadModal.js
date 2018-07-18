import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
const LoadModal = props => {
  const {
    loading,
    ...attributes
  } = props;
return (
    <Modal
      visible={loading}></Modal>
  )
}
const styles = StyleSheet.create({

});
export default Loader;
