import * as React from 'react';

import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
// @ts-ignore
import { TooltipMenu } from 'react-native-tooltip-menu';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TooltipMenu
          style={{
            position: 'absolute',
            bottom: 0,
            left: 10,
          }}
          items={[
            {
              label: 'test asdf asdf asdf asdf asd fas dsdsdsd',
              onPress: () => {
                // @ts-ignore
                alert('pressed test');
              },
            },
            {
              label: () => <Text style={{ color: 'red' }}>Test2</Text>,
              onPress: () => {
                // @ts-ignore
                alert('pressed test2');
              },
            },
          ]}
        >
          <View
            style={{
              backgroundColor: 'red',
              padding: 20,
              width: 200,
              borderRadius: 10,
            }}
          >
            <Text>Button</Text>
          </View>
        </TooltipMenu>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    position: 'relative',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
