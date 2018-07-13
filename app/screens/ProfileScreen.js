import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import * as firebase from 'firebase';

export default class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Profile',
  }

  constructor(props) {
    super(props);

    this.state = {
      email: ''
    };
  }

  componentWillMount() {
    let user = firebase.auth().currentUser;
    if (user) {
      this.setState({
        email: user.email,
      });
    }
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.props.navigation.popToTop();
    });
  }

  render() {
    return(
      <View>
        <Text>Profile Screen</Text>
        <Text>Currently logged in as {this.state.email}</Text>
        <Text>Your paired devices:</Text>
        <Button title="Logout" onPress={() => this.logout()}/>
      </View>
    )
  }
}
