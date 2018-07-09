import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

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
        console.log(user);
        // this.setState({
        //   email: user.email,
        // });
      }
    })
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('login');
    });
  }

  render() {
    return(
      <View>
        <Text>Profile Screen</Text>
        <Button title="Logout" onPress={() => this.logout()}/>
      </View>
    )
  }
}
