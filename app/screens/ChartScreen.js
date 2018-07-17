import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';

import * as firebase from 'firebase';
require("firebase/firestore");

import { firebaseConfig } from '../../firebase-config.js';
const firebaseApp = firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings);

export default class ChartScreen extends Component {
  static navigationOptions = {
    title: 'Click History',
  }

  constructor(props) {
    super(props);
    this.userClicksDoc = firebaseApp.firestore().collection('clicks').doc(this.props.screenProps.currentUser.uid);
    this.state = {

    };
  }

  componentDidMount() {
    this.getInitialData();
  }

  getInitialData() {
    var initialClicks = [];
    this.userClicksDoc.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.data());
        clicksObject = doc.data();
        for( key in clicksObject ) {
          initialClicks.push(clicksObject[key].timestamp);
        }
        this.setState({ clicks: initialClicks });
      })
    }).catch((error) => {
      console.log('error getting initial data');
      throw error;
    });

    console.log(initialClicks);
    console.log(this.state.clicks);
  }

  listenForData(userClicksDoc) {
    // var clicks = [];

    // userClicksDoc.on('value', (snap) => {
    //   snap.forEach((child) => {
    //     clicks.push({
    //       timestamp: child.timestamp,
    //       _key: child.key
    //     });
    //   });
    // });

    // this.setState({
    //   clicks: clicks
    // });
  }

  render() {
    return(
      <View>
        <Text>Chart Screen</Text>
        <FlatList
          data={this.state.clicks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <Text>{item.seconds}</Text>}
          >
        </FlatList>
      </View>
    )
  }
}
