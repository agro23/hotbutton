import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import { withNavigation } from 'react-navigation';
import * as firebase from 'firebase';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({
          isLoggedIn: true,
        });
      } else {
        this.setState({
          isLoggedIn: false,
        });
      }
    });
  }

  render() {
    let login;

    if (!this.state.isLoggedIn) {
      login = <Button title="Login" onPress={() => this.props.navigation.navigate('login')}/>;
    } else {
      login = null;
    }

    return(
      <View style={styles.navContainer}>
        <Button title="Charts" onPress={() => this.props.navigation.navigate('chart')}/>
        <Button title="Profile" onPress={() => this.props.navigation.navigate('profile')}/>
        <Button title="Bluetooth" onPress={() => this.props.navigation.navigate('bluetooth')}/>
        {login}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    flexDirection: 'row'
  }
})

export default withNavigation(NavBar);
