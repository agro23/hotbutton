import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as scale from 'd3-scale';

import { BarChart, LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';

export default class DayChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    let data = this.props.formattedClicks;
    // let yLabelData = data.map((entry) => entry.hour);
    // console.log('y axis lables', yLabelData);
    const otherData = [ 14, 80, 100, 55 ];

    const lastData = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80, 150 ]
    const axesSvg = { fontSize: 10, fill: 'grey' };
    const verticalContentInset = { top: 10, bottom: 10 }
    const xAxisHeight = 30
    //let hours = ['0a','1a','2a','3a','4a','5a','6a','7a','8a','9a','10a','11a','12a','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p'];
    // const data = [ 50, 10, 40, 95, 85 ]
    return(
      <View>
        <Text>Click distribution for past 24 hours:</Text>
        <View style={{ flexDirection: 'row', height: 200, padding: 20 }}>
          <YAxis
              data={data}
              style={{ marginBottom: xAxisHeight }}
              contentInset={verticalContentInset}
              svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <BarChart
              style={{ flex: 1 }}
              data={data}
              yAccessor={ ({item}) => item.clicks }
              // xAccessor={ ({item}) => item.hour }
              svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
              // contentInset={{ top: 10, bottom: 10 }}
              // spacing={0.2}
              // gridMin={0}
              >
              <Grid direction={Grid.Direction.HORIZONTAL}/>
            </BarChart>
            <XAxis
              style={{ marginTop: 10 }}
              data={ data }
              // scale={scale.scaleBand}
              contentInset={{ top: 10, bottom: 10 }}
              labelStyle={ { color: 'black' } }
              xAccessor={ ({item}) => item.hour }
            />

          </View>
        </View>

        {/* <View style={{ height: 200, padding: 20 }}>
            <BarChart
                style={{ flex: 1 }}
                data={otherData}
                gridMin={0}
                svg={{ fill: 'rgb(134, 65, 244)' }}
            />
            <XAxis
                style={{ marginTop: 10 }}
                data={ otherData }
                // scale={scale.scaleBand}
                formatLabel={ (value, index) => index }
                labelStyle={ { color: 'black' } }
            />
        </View> */}


        <View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
          <YAxis
              data={lastData}
              style={{ marginBottom: xAxisHeight }}
              contentInset={verticalContentInset}
              svg={axesSvg}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <LineChart
                style={{ flex: 1 }}
                data={lastData}
                contentInset={verticalContentInset}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
            >
              <Grid/>
            </LineChart>
            <XAxis
              style={{ marginHorizontal: -10, height: xAxisHeight }}
              data={lastData}
              formatLabel={(value, index) => index}
              contentInset={{ left: 10, right: 10 }}
              svg={axesSvg}
            />
          </View>
        </View>
    </View>
    )


  }
}

const styles = StyleSheet.create({

});
