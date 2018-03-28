import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ReactNativeTooltipMenu from 'react-native-tooltip-menu';

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <ReactNativeTooltipMenu
          buttonComponent={
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text>Siema</Text>
            </View>
          }
          items={[
            {
              label: 'to',
              onPress: () => {},
            },
          ]}
        />

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
