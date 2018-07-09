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

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: ''
    };
  }

  async submitForm() {
    try {
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        this.props.navigation.navigate('home');
    } catch (error) {
        this.setState({message: error.message});
        console.log('error signing in', error);
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.header}>Login:</Text>
        <TextInput
          style={styles.input}
          placeholder="email"
          autoCapitalize="none"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}></TextInput>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="password"
          autoCapitalize="none"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}></TextInput>
        <Button title="Login" onPress={() => this.submitForm()}></Button>
        <Button title="Need an account?" onPress={() => this.props.navigation.navigate('signup')}></Button>
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
    fontSize: 30,
    padding: 30
  },
  input: {
    fontSize: 15,
    padding: 10
  },
  button: {
    backgroundColor: '#e8e8e8',
    padding: 20
  }
})
