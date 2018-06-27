import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return(
      <View>
        <Button title="Navbar Charts" onPress={() => this.props.navigation.navigate('chart')}/>
      </View>
    )
  }
}
