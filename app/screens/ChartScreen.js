import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';

import { BarChart, Grid } from 'react-native-svg-charts';

import LoadModal from '../components/LoadModal';
import DayChart from '../components/DayChart';
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
      clicks: [0],
      loading: true
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
      initialClicks = Object.keys(doc.data()).map((item) => parseInt(item) );
      this.setState({
        clicks: initialClicks,
        loading: false
      });
    }).catch((error) => {
      console.log('error getting initial data');
      throw error;
    });
  }


  render() {
    const chartFill = 'rgb(134, 65, 244)';
    // let data = [ 10, 5, 25, 15, 20 ];
    let data = this.state.clicks;

    return(
      <View>
        <Text>Chart Screen</Text>
        <LoadModal loading={this.state.loading}/>
        <DayChart clicks={this.state.clicks}/>
        {/* <BarChart
          style={{ flex: 1, margin: 15 }}
          data={data}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
          contentInset={{ top: 10, bottom: 10 }}
          spacing={0.2}
          gridMin={0}
          >
          <Grid direction={Grid.Direction.VERTICAL}/>
        </BarChart> */}
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
