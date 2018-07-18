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
      dayData: new Map() //day will be default, i.e. data auto processes here
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
    //filter clicks to include only past 24 hours
    let filteredClicks = [];
    let dayEnd = Date.now();
    let dayStart = Date.now() - (8.64*10e7);
    clickArray.forEach((click) => {
      if (click < dayEnd && click > dayStart) {
        filteredClicks.push(click);
      }
    })
    console.log('filtered clicks: ', filteredClicks);

    // map clicks to 24 hours
    let hourMap = new Map();
    filteredClicks.forEach((click) => {
      let asDate = new Date(click);
      let hourIndex = asDate.getHours();
      let alreadyMapped = hourMap.get(hourIndex) || [];
      alreadyMapped.push(click);
      hourMap.set(hourIndex, alreadyMapped);
    });
    console.log('hour map: ', hourMap);
    this.setState(dayData: hourMap);
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
