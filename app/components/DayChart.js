import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BarChart, Grid } from 'react-native-svg-charts';

export default class DayChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.filterClicks();
  }

  // filterClicks() {
  //   let filteredClicks = [];
  //   let dayEnd = Date.now();
  //   let dayStart = Date.now() - (8.64*10e7);
  //   this.props.clicks.forEach((click) => {
  //     if (click < dayEnd && click > dayStart) {
  //       filteredClicks.push(click);
  //     }
  //   })
  //   this.mapClicksToHours(filteredClicks);
  // }
  //
  // mapClicksToHours(clickArray) {
  //   let hourMap = new Map();
  //   clickArray.forEach((click) => {
  //     let asDate = new Date(click);
  //     let hourIndex = asDate.getHours();
  //     let alreadyMapped = hourMap.get(hourIndex);
  //     alreadyMapped.push(click);
  //     hourMap.set(hourIndex, alreadyMapped);
  //   });
  //   console.log('hour map: ', hourMap);
  //   }


  render() {
    let data = this.props.clicks;
    // const data = [ 50, 10, 40, 95, 85 ]
    return(

      <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
        <Text>Day chart:</Text>

        <BarChart
          style={{ flex: 1, margin: 15 }}
          data={data}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
          contentInset={{ top: 10, bottom: 10 }}
          spacing={0.2}
          gridMin={0}
          >
          <Grid direction={Grid.Direction.VERTICAL}/>
        </BarChart>
      </View>
    )


  }
}

const styles = StyleSheet.create({

});
