import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class DeviceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {

    return(
      <View style={styles.cardContainer}>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    backgroundColor: '#414141',
    width: 200,
    height: 150
  }
})
