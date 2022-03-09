# react-native-tooltip-menu

Currently works only with `iOS` and `Android`.

Component for specfied case. Left bottom button with nice looking menu tooltip with animation after click.

![alt text](https://github.com/alimek/react-native-tooltip-menu/raw/master/Doc/ios.gif "React Native ToolTip Menu")
![alt text](https://github.com/alimek/react-native-tooltip-menu/raw/master/Doc/android.gif "React Native ToolTip Menu")


# How to install

Via NPM

```bash
npm install react-native-tooltip-menu
```

Via yarn
```bash
yarn add react-native-tooltip-menu
```

then

```js
import { TooltipMenu } from 'react-native-tooltip-menu';
```

# Configuration

## ReactNativeTooltipMenu:

| Property            | Type                      | Default                                                    | Description                                                                                                                                                                                  |
|---------------------|---------------------------|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| children            | ReactNode                 | required                                                       |                                                                                                                                                                                              |
| items               | `Array`                   | required                             | Items to be rendered in menu. Each of item requires `label` as `string` or `function` if you want to render your own component and `onPress` as `function` to be called when you click item. |
| style               | `ViewStyle`               | Optional                                                   | Style `Object` if you want to overwrite wrapper for your `children`|
| overlayStyle        | Object                    | Optional                                                   | Style `Object` if you want to overwrite overlay style's.|
| widthType           | `auto`, `half` or `full`  | `auto`                                                     | Menu items width. `auto` = automatically set width to your longest test, `half` = always 50% your screen width, `full` = 100% screen width.|
| onRequestClose      | `function`                | Optional, default `() => {}`                               | Modal onRequestClose required function on Android|
| labelContainerStyle | `Object`                  | Optional                                                   | Style `Object` if you want to change default `TooltipMenuItem` View's style.|
| labelStyle          | `Object`                  | Optional                                                   | Style `Object` if you want to change default `TooltipMenuItem` Text's style.|
| modalButtonStyle    | `Object`                  | optional                                                   | Style. for `TouchabelOpacity` when modal is opened.|
| trianglePosition    | `left`, `center`, `right` | `center`                                                   | Position of the triangle.|
# Example

```js
import { TooltipMenu } from 'react-native-tooltip-menu';

const Example = () => (
  <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 25 }}>
    <View>
      <Text style={{ textAlign: 'center' }}>This is example of react-native-tooltip-menu</Text>
      <Text style={{ textAlign: 'center' }}>Clicked item1: {counter1}</Text>
      <Text style={{ textAlign: 'center' }}>Clicked item2: {counter2}</Text>
    </View>
    <TooltipMenu
      items={[
        {
          label: 'Label #1',
          onPress: () => incrementCounter1()
        },
        {
          label: 'Label #2',
          onPress: () => incrementCounter2(),
        },
      ]}
    >
      <View
        style={{
          backgroundColor: 'purple',
          padding: 10,
          borderRadius: 25
        }}
      >
        <Text style={{ color: 'white', flex: 1 }}>Click me to show tooltip!</Text>
      </View>
    </TooltipMenu>
  </View>
);
```
