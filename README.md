# react-native-tooltip-menu

Currently works only with `iOS` and `Android`.

Component for specfied case. Left bottom button with nice looking menu tooltip with animation after click.

![alt text](https://github.com/alimek/react-native-tooltip-menu/raw/master/Doc/ios.gif "React Native ToolTip Menu")
![alt text](https://github.com/alimek/react-native-tooltip-menu/raw/master/Doc/android.gif "React Native ToolTip Menu")


# How to install
 
Via NPM

```bash
npm install react-native-tooltip-menu --save
```

or via yarn
```bash
yarn add react-native-tooltip-menu --save
```

then 

```js
import ReactNativeMenuTooltip from 'react-native-tooltip-menu';
```

# Configuration

## ReactNativeTooltipMenu:

| Property | Type | Default | Description |
|----------------|---------------|-----------|--------------------------------------|
| buttonComponent | |||
| items | `Array` | | Items to be rendered in menu. Each of item requires `label` as `string` or `function` if you want to render your own component and `onClick` as `function` to be called when you click item. |
| componentWrapperStyle | Object | Optional | Style `Object` if you want to overwrite wrapper for your `buttonComponent`
| overlayStyle | Object | Optional | Style `Object` if you want to overwrite overlay style's.
| widthType | `auto`, `half` or `full` | `half` | Menu items width. `Auto` = automatically set width to your longest test, `half` = always 50% your screen width, `full` = 100% screen width.
| onRequestClose | `function` | Optional, default `() => {}` | Modal onRequestClose required function on Android 
| labelContainerStyle | `Object` | Optional | Style `Object` if you want to change default `TooltipMenuItem` View's style.
| labelStyle | `Object` | Optional | Style `Object` if you want to change default `TooltipMenuItem` Text's style.
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

## Todo

* add option to move button to right side of screen
* add `isVisible` prop
