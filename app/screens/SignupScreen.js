import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

import * as firebase from 'firebase';
// import { firebaseConfig } from '../../firebase-config.js';
// const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      message: ''
    };
  }

  submitForm() {
    if (this.state.password == this.state.confirmPassword) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch((error) => {
        this.setState({message: error.message});
        console.log('error creating user', error);
      })
      .then(this.props.navigation.navigate('home'));
    } else {
      this.setState({message: "Passwords don't match"})
    }

  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.header}>Sign Up:</Text>
        <TextInput
          placeholder="email"
          autoCapitalize="none"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}></TextInput>
        <TextInput
          secureTextEntry
          placeholder="password"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}></TextInput>
        <TextInput
          secureTextEntry
          placeholder="confirm password"
          autoCapitalize="none"
          value={this.state.confirmPassword}
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}></TextInput>
        <Button title="Sign Up" onPress={() => this.submitForm()}></Button>
        <Text>{this.state.message}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 30
  }
})
