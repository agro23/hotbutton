/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { createStackNavigator } from 'react-navigation';
import ButtonScreen from './screens/ButtonScreen';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <NavigationStack/>
    );
  }
}

const NavigationStack = createStackNavigator(
  {
    home: ButtonScreen,
    // chart: ChartScreen,
    // profile: ProfileScreen
  },
  {
    initialRouteName: 'home'
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
