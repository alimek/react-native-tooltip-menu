import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import PopoverTooltip from 'react-native-popover-tooltip';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 1
    };
  }
  render() {
    return (
      <View style={{flex:1, alignSelf:'stretch', alignItems:'center', justifyContent:'flex-start', backgroundColor:'#fff'}}>
        <View style={{height: 40}} />
        <Text>Default Effect</Text>
        <PopoverTooltip
          ref='tooltip1'
          buttonComponent={
            <View style={{width:200, height:50, backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
              <Text>
                Press Me
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
          ]}
          // animationType='timing'
          // using the default timing animation
          />

        <View style={{height:40}}/>
        <Text>Spring Effect</Text>
        <PopoverTooltip
          ref='tooltip2'
          buttonComponent={
            <View style={{width:200, height:50, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
              <Text>
                Press Me
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
          ]}
          animationType='spring' // spring-damper animation
          springConfig={{tension: 100, friction: 3}} // tension controls the potential of the spring effect,
                                                     // friction controls the damper effect
          />

        <View style={{height: 40}}/>
        <Text>Button Expansion</Text>
        <PopoverTooltip
          ref='tooltip3'
          buttonComponent={
            <View style={{width:200, height:50, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
              <Text>
                Press Me
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
          ]}
          animationType='spring'
          buttonComponentExpandRatio={1.2} // ratio of button component expansion after tooltip poped up
          />

        <View style={{height: 40}}/>
        <Text>Custom Styles</Text>
        <PopoverTooltip
          ref='tooltip4'
          buttonComponent={
            <View style={{width:200, height:50, backgroundColor: '#ED5736', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
              <Text>
                Press Me
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
          ]}
          animationType='spring'
          overlayStyle={{backgroundColor: 'transparent'}} // set the overlay invisible
          tooltipContainerStyle={{borderRadius:0}}
          labelContainerStyle={{backgroundColor: '#ED5736', width: 120, alignItems: 'center'}}
          labelSeparatorColor='#1BD1A5' />

        <View style={{height: 40}}/>
        <Text>Slow Button</Text>
        <PopoverTooltip
          ref='tooltip5'
          buttonComponent={
            <View style={{width:200, height:50, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
              <Text>
                Press Me
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
          ]}
          // animationType='timing'
          // using the default timing animation
          timingConfig={{duration: 1000}}
          opacityChangeDuration={1000} />

        <View style={{height: 40}}/>
        <TouchableOpacity
          style={{width:200, height:50, backgroundColor: '#B0A4E3', justifyContent: 'center', alignItems: 'center', borderRadius: 5}}
          onPress={() => {
            this.refs['tooltip'+this.state.order].toggle(); // open popover tooltips one by one
            this.setState({order: (this.state.order)%5+1 });
          }}>
          <Text>
            Open Tooltip {this.state.order}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
