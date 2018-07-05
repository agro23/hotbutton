import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';

import * as firebase from 'firebase';

import firebaseConfig from '../../firebase-config.js';
const firebaseApp = firebase.initializeApp(firebaseConfig)

export default class ChartScreen extends Component {
  constructor(props) {
    super(props);
    this.dataRef = firebaseApp.database().ref();
    this.state = {
      clicks: [];
    };
  }

  componentDidMount() {
    this.listenForData(this.dataRef);
  }

  listenForData(dataRef) {
    dataRef.on('value', (snap) => {
      var clicks = [];
      snap.forEach((child) => {
        clicks.push({
          timestamp: child.timestamp,
          _key: child.key
        });
      });
    });

    this.setState({
      clicks: clicks
    })
  }

  render() {
    return(
      <View>
        <Text>Chart Screen</Text>
        <FlatList
          data={this.state.clicks}
          renderItem={({click}) => <Text>click.timestamp</Text>}
          >
        </FlatList>
      </View>
    )
  }
}
