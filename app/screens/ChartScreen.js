import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
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
    this.fbClickCollection = firebaseApp.firestore().collection('clicks');
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    if (this.props.screenProps.currentUser != null) {
      this.setState({ isLoggedIn: true })
      this.getInitialData(this.props.screenProps.currentUser.uid);
    }
  }

  getInitialData(userId) {
    var initialClicks = [];
    console.log('userid: ', userId);
    this.fbClickCollection.doc(userId.toString()).get().then((doc) => {
      initialClicks = Object.keys(doc.data());
      this.setState({ clicks: initialClicks });
    }).catch((error) => {
      console.log('error getting initial data');
      throw error;
    });
  }

  listenForData(fbClickCollection) {
    // var clicks = [];

    // fbClickCollection.on('value', (snap) => {
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
    const chartFill = 'rgb(134, 65, 244)';
    const data = [ 10, 5, 25, 15, 20 ];

    return(
      <View>
        <Text>Chart Screen</Text>
        <BarChart
                    style={{ flex: 1, marginLeft: 8 }}
                    data={data}
                    horizontal={true}
                    svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
        >
          <Grid direction={Grid.Direction.VERTICAL}/>
        </BarChart>
        {/* <BarChart
          data={data}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}

          >
          <Grid direction={Grid.Direction.HORIZONTAL}/>
        </BarChart> */}
        <FlatList
          data={this.state.clicks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <Text>{item}</Text>}
          >
        </FlatList>
      </View>
    )
  }
}
