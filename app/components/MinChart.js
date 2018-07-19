import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as scale from 'd3-scale';

import { BarChart, Grid, XAxis } from 'react-native-svg-charts';

export default class MinChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    let data = this.props.formattedClicks;
    //let hours = ['0a','1a','2a','3a','4a','5a','6a','7a','8a','9a','10a','11a','12a','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p'];
    console.log('min chart formatted clicks: ', this.props.formattedClicks);
    // const data = [ 50, 10, 40, 95, 85 ]
    return(
      <View>
        <Text>Click distribution for past 30 minutes:</Text>
        <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
          <BarChart
            style={{ flex: 1, margin: 15 }}
            data={data}
            yAccessor={ ({item}) => item.clicks }
            svg={{ fill: 'rgba(134, 65, 244, 0.8)', }}
            contentInset={{ top: 10, bottom: 10 }}
            spacing={0.2}
            gridMin={0}
            >
            <XAxis
              style={{ marginTop: 10 }}
              data={ data }
              contentInset={{ top: 10, bottom: 10 }}
              formatLabel={ (value, index) => index }
              labelStyle={ { color: 'black' } }
              // xAccessor={ ({item}) => item.hour }
            />
            <Grid direction={Grid.Direction.VERTICAL}/>
          </BarChart>
        </View>
      </View>
    )


  }
}

const styles = StyleSheet.create({

});
