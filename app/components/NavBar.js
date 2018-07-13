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
    let loginOrProfile;
    if (!this.state.isLoggedIn) {
      loginOrProfile = <Button color="#edece4" title="Login" onPress={() => this.props.navigation.navigate('login')}/>;
    } else {
      loginOrProfile = <Button color="#edece4" title="Profile" onPress={() => this.props.navigation.navigate('profile')}/>;
    }

    return(
      <View style={styles.navContainer}>
        <Button color="#edece4" title="Charts" onPress={() => this.props.navigation.navigate('chart')}/>
        <Button color="#edece4" title="Device" onPress={() => this.props.navigation.navigate('bluetooth')}/>
        {loginOrProfile}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#9f939b'
  }
})

export default withNavigation(NavBar);
