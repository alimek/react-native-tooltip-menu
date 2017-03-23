/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';

import ReactNativeTooltipMenu from 'react-native-tooltip-menu';

class Example extends Component {
  state = {
    counter: 0,
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 25 }}>
        <View>
          <Text style={{ textAlign: 'center' }}>This is example of react-native-tooltip-menu</Text>
          <Text style={{ textAlign: 'center' }}>Clicked: {this.state.counter}</Text>
        </View>
        <ReactNativeTooltipMenu
          buttonComponent={
            <View
              style={{
                backgroundColor: 'purple',
                padding: 10,
                borderRadius: 25
              }}
            >
              <Text style={{ color: 'white', flex: 1 }}>Click me to show tooltip!</Text>
            </View>
          }
          items={[
            {
              label: 'Label #1',
              onPress: () => this.setState({ counter: (this.state.counter + 1) })
            },
            {
              label: 'Label #2',
              onPress: () => this.setState({ counter: (this.state.counter + 1) }),
            },
          ]}
        />
      </View>
    )
  }
}

AppRegistry.registerComponent('Example', () => Example);
