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
        <Text>Currently connected to:</Text>
        <Text>{this.props.screenProps.connectedDevice.name}</Text>
        <Text>Last click: {this.props.screenProps.lastClick}</Text>
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
    justifyContent: 'space-between',
    // paddingHorizontal: 10,
    alignItems: 'center'
  },
  countContainer: {
    alignItems: 'center',
    padding: 3
  },
  countText: {
    color: 'black',
    fontSize: 33,
    color: '#414141'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    borderRadius: 150/2,
    backgroundColor: '#b8d6ce',
    alignItems: 'center',
    padding: 10,
    margin: 120,
    alignItems: 'center'
  }
});
