import React from 'react';
import { Text, View } from 'react-native';
import PopoverTooltip from 'react-native-popover-tooltip';

export default class App extends React.Component {
  render() {
    return (
      <View style={{flex:1, alignSelf:'stretch', alignItems:'center', justifyContent:'center', backgroundColor:'#fff'}}>
        <PopoverTooltip
          buttonComponent={
            <View style={{width:200, height:50, backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center'}}>
              <Text>
                Click Me
              </Text>
            </View>
          }
          items={[
            {
              label: 'Item 1',
              onPress: () => {}
            },
            {
              label: 'Item 2',
              onPress: () => {}
            }
          ]} />
      </View>
    );
  }
}
