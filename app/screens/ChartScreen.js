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
      loading: true,
      dayData: [0] //day will be default, i.e. data auto processes here
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
    this.fbClickCollection.doc(userId.toString()).get().then((doc) => {
      initialClicks = Object.keys(doc.data()).map((item) => parseInt(item) );
      this.setState({
        clicks: initialClicks,
        loading: false
      });
      console.log('all clicks from fb: ', initialClicks);
      this.processDayChartData(initialClicks);
    }).catch((error) => {
      console.log('error getting initial data', error);
      throw error;
    });
  }

  processDayChartData(clickArray) {
    //filter clicks to include only past 24 hours:
    let filteredClicks = [];
    let dayEnd = Date.now();
    let dayStart = Date.now() - (8.64*10e7);
    clickArray.forEach((click) => {
      if (click < dayEnd && click > dayStart) {
        filteredClicks.push(click);
      }
    })


    //map clicks to 24 hours, can probably skip this step and go straight to formatted array for chart:
    let hourMap = new Map();
    filteredClicks.forEach((click) => {
      let asDate = new Date(click);
      let hourIndex = asDate.getHours();
      let alreadyMapped = hourMap.get(hourIndex) || [];
      alreadyMapped.push(click);
      hourMap.set(hourIndex, alreadyMapped);
    });
    console.log('hourmap: ', hourMap);

    //reformat into array for charting:
    let chartData = [];
    let hours = [];
    for (i=0; i<24; i++) {
      hours.push(i);
    }
    hours.forEach((hour) => {
      let clicks = hourMap.get(hour) || [];
      let formatHr = '';
      if (hour <= 12) {
        formatHr = hour.toString() + 'a';
      } else {
        formatHr = (hour - 12).toString() + 'p';
      }
      chartData.push({
        hour: formatHr,
        clicks : clicks.length
      });
    });
    console.log('formatted data: ', chartData);
    this.setState({dayData: chartData});
  }



  render() {

    return(
      <View>
        <Text>Chart Screen</Text>
        <LoadModal loading={this.state.loading}/>
        <DayChart
          clicks={this.state.clicks}
          formattedClicks={this.state.dayData}/>
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
