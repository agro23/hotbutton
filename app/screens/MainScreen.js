import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'

import * as firebase from 'firebase';
import NavBar from '../components/NavBar';

const welcomeMessage = "Welcome to the smart button app. Here you can manage your profile, register a smart button, and access data and about your usage of the button.";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isNewUser: true
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // avail user properties:
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        this.setState({
          isLoggedIn: true,
          isNewUser: false
        });
      } else {
        this.setState({
          isLoggedIn: false,
        });
      }
    })
  }

  onPress = () => {
    this.setState({
      count: this.state.count+1
    });
  }

  render() {
    return (
      <View style={styles.container}>
        if (this.state.isNewUser) {
          <Text>{welcomeMessage}</Text>
        }
        <NavBar/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center'
  }
});
