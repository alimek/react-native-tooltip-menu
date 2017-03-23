# react-native-tooltip-menu

Currently works only with `iOS`. `Android` coming soon.

This component is a clickable button which will show you a tooltip menu with clickable menu.
You can very easily customize how the component will look like.

![alt text](https://github.com/alimek/react-native-tooltip-menu/Doc/screenshot.gif "React Native ToolTip Menu")


# How to install

```bash
npm install react-native-tooltip-menu --save
```
# Example

```js
import MenuTooltip from 'react-native-tooltip-menu';

const YourContainer = ({ onClick }) => (
  <MenuTooltip
    buttonComponent={
      <View>
        <Text>Click me to show tooltip!</Text>
      </View>
    }
    items={[
      {
        label: 'Label #1',
        onPress: () => console.log('Pressed Label #1'),
      },
      {
        label: 'Label #2',
        onPress: onClick,
      },
    ]}
  />
);
```

# License

