import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import { withNavigation } from 'react-navigation';

class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return(
      <View style={styles.navContainer}>
        <Button title="Charts" onPress={() => this.props.navigation.navigate('chart')}/>
        <Button title="Profile" onPress={() => this.props.navigation.navigate('profile')}/>
        <Button title="Bluetooth" onPress={() => this.props.navigation.navigate('bluetooth')}/>
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
