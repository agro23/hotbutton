import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Button
} from 'react-native'

import NavBar from '../components/NavBar';

export default class ButtonScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }

  onPress = () => {
    this.setState({
      count: this.state.count+1
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar/>
          <TouchableOpacity style={styles.circle} onPress={this.onPress}>
            <Text style={styles.alignMe}> Push </Text>
          </TouchableOpacity>
          <View style={[styles.countContainer]}>
            <Text style={[styles.countText]}>
              { this.state.count !== 0 ? this.state.count: null}
            </Text>
          </View>
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
  },
  alignMe: {
    // flex: 1,
    // alignItems: 'center',
    // textAlign: 'center',
    // marginTop: 0,
    // fontStyle: 'italic'
    fontSize: 33
  },
  // button: { // not using this now
  //   alignItems: 'center',
  //   backgroundColor: '#ff00ff',
  //   padding: 10,
  //   margin: 50
  // },
  countContainer: {
    alignItems: 'center',
    padding: 3
  },
  countText: {
    color: 'black',
    backgroundColor: 'cyan'
  },
  circle: { // replaced button with this style
    // flexDirection: 'column',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    borderRadius: 150/2,
    backgroundColor: 'turquoise',
    alignItems: 'center',
    padding: 10,
    margin: 120,
    borderWidth:5,
    borderColor: 'darkblue',
    alignItems: 'center'
  }
});
