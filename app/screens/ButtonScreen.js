import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'

import NavBar from '../components/NavBar';
import DeviceCard from '../components/DeviceCard';

export default class ButtonScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }

  onPress = () => {
    this.setState({
      count: this.state.count+1
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.deviceCardContainer}>
          <DeviceCard connectedDevice={this.props.screenProps.connectedDevice}/>
        </View>
        <View style={styles.clickInfoContainer}>
          <Text style={{flex: 1}} >Last click: {this.props.screenProps.lastClick}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.onPress}>
          <Text style={[styles.countText]}>
            { this.state.count !== 0 ? this.state.count : 'Push'}
          </Text>
        </TouchableOpacity>
        <NavBar/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    // paddingHorizontal: 10,
    alignItems: 'center'
  },
  deviceCardContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 30
  },
  clickInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 30
  },
  countContainer: {
    alignItems: 'center',
    // padding: 3
  },
  countText: {
    color: 'black',
    fontSize: 33,
    color: '#414141'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150/2,
    backgroundColor: '#b8d6ce',
    width: 150,
    height: 150,
    // padding: 10,
    // margin: 120,
  }
});
