import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TooltipMenu from 'react-native-tooltip-menu';

export default function App() {
  const [counter, setCount] = React.useState<number>(0);
  return (
    <View style={styles.container}>
      <Text>Result: {counter}</Text>
      <TooltipMenu
        triangleStyle={{ borderTopColor: 'green' }}
        buttonComponent={
          <View
            style={{
              backgroundColor: 'purple',
              padding: 10,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: 'white', flex: 1 }}>
              Click me to show tooltip!
            </Text>
          </View>
        }
        items={[
          {
            label: 'Label #1 Increment',
            onPress: () => {
              setCount(counter + 1);
            },
          },
          {
            label: 'Label #2 Decrement',
            onPress: () => {
              setCount(counter - 1);
            },
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
