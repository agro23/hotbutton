import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class DayChart extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {

  }

  render() {

    return(
      <View style={styles.card}>
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

})
