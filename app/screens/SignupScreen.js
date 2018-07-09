import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

export default class SignupScreen extends Component {
  this.state = {
    email: '',
    password: ''
  };

  render() {
    return(
      <View>
        <Text>Signup Screen</Text>
        <TextInput
          placeholder="email"
          value={this.state.email}
          onChangeText={() => this.setState({ email })}></TextInput>
        <TextInput
          placeholder="password"
          value={this.state.password}
          onChangeText={() => this.setState({ password })}></TextInput>
          <Button title="Signup"></Button>
      </View>
    )
  }
}
