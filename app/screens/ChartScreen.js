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
import MinChart from '../components/MinChart';
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
      dayData: [0], //day will be default, i.e. data auto processes here
      minData: [0]
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
      this.processMinChartData(initialClicks);
      this.processTwoWeekChartData(initialClicks);
    }).catch((error) => {
      console.log('error getting initial data', error);
      this.setState({
        loading: false
      })
      throw error;
    });
  }

  processDayChartData(clickArray) {
    //filter clicks to include only past 24 hours:
    let filteredClicks = [];
    let dayEnd = Date.now();
    let dayStart = Date.now() - (8.64e7);
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
    // console.log('hourmap: ', hourMap);

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
    console.log('formatted day data: ', chartData);
    this.setState({dayData: chartData});
  }

  processMinChartData(clickArray) {
    let filteredClicks = [];
    let periodEnd = Date.now();
    let periodStart = periodEnd - 1.8e6;
    clickArray.forEach((click) => {
      if (click >= periodStart && click <= periodEnd) {
        filteredClicks.push(click)
      }
    });
    console.log('filtered for past 30 minutes: ', filteredClicks);

    //loop through minutes of period, checking filtered clicks for each minute
    let formattedData = [];
    let minStart = periodStart;
    let minEnd = minStart + 60000;
    for (i=0; i<30; i++) {
      let clickCounter = 0;
      for (j=filteredClicks.length-1; j>=0; j--) {
        let click = filteredClicks[j];
        if (click >= minStart && click < minEnd) {
          //remove that value from bank for efficiency
          filteredClicks.splice(j, 1);
          clickCounter += 1;
        }
      }
      formattedData.push({minute: i, clicks: clickCounter})
      minStart += 60000;
      minEnd += 60000;
    }
    console.log('formatted minute chart data: ', formattedData);
    this.setState({ minData: formattedData });
  }

  processTwoWeekChartData(clickArray) {
    //filter
    let periodEnd = Date.now();
    let periodStart = periodEnd - 1.21e9;
    let filteredClicks = [];
    clickArray.forEach((click) => {
      if (click >= periodStart && click <= periodEnd) {
        filteredClicks.push(click);
      }
    });

    //format
    let dayStart = periodStart;
    let dayEnd = dayStart + 8.64e7;
    let formattedData = [];
    for(i=0; i<14; i++) {
      let dayClickCount = 0;
      for(j=filteredClicks.length - 1; j >= 0; j--) {
        let click = filteredClicks[j];
        if (click >= dayStart && click < dayEnd) {
          filteredClicks.splice(j,1);
          dayClickCount += 1;
        }
      }
      formattedData.push({day: i, clicks: dayClickCount});
      dayStart += 8.64e7;
      dayEnd += 8.64e7;
    }
    console.log('formatted two weeks data: ', formattedData);
  }

  render() {
    return(
      <View>
        <LoadModal loading={this.state.loading}/>
        <DayChart
          clicks={this.state.clicks}
          formattedClicks={this.state.dayData}/>
        {/* <MinChart
          formattedClicks={this.state.minData}/> */}
      </View>
    )
  }
}
