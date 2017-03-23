# react-native-tooltip-menu

Currently works only with `iOS`. `Android` coming soon.

This component is a clickable button which will show you a tooltip menu with clickable menu.
You can very easily customize how the component will look like.

![alt text](https://github.com/alimek/react-native-tooltip-menu/raw/master/Doc/screenshoot.gif "React Native ToolTip Menu")


# How to install

```bash
npm install react-native-tooltip-menu --save
```
# Example

```js
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

```

# License

