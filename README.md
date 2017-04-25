# react-native-tooltip-menu

Currently works only with `iOS` and `Android`.


# How to install

```bash
npm install react-native-popover-tooltip --save
```

then 

```js
import PopoverTooltip from 'react-native-popover-tooltip';
```

# Configuration

## ReactNativeTooltipMenu:

| Property | Type | Default | Description |
|----------------|---------------|-----------|--------------------------------------|
| buttonComponent | |||
| items | `Array` | | Items to be rendered in menu. Each of item requires `label` as `string` or `function` if you want to render your own component and `onClick` as `function` to be called when you click item. |
| componentWrapperStyle | Object | Optional | Style `Object` if you want to overwrite wrapper for your `buttonComponent`
| overlayStyle | Object | Optional | Style `Object` if you want to overwrite overlay style's.
| this.props.opacityChangeDuration | `number` | 200 | Duration that the screen-size overlay changes from transparent to non-transparent and vice verse.
| onRequestClose | `function` | Optional, default `() => {}` | Modal onRequestClose required function on Android 
| labelContainerStyle | `Object` | Optional | Style `Object` if you want to change default `TooltipMenuItem` View's style.
| labelStyle | `Object` | Optional | Style `Object` if you want to change default `TooltipMenuItem` Text's style.
| animationType | `String` | timing | Tooptip popping animation. timing = popup within a specific duration, spring = popup with a spring bumper model.
| timingConfig | `Object` | {duration: 200} | Configuration of timing animation. Attribute duration is the duration of the animation.
| springConfig | `Object` | {tension: 100, friction: 7} | Configuration of spring animation. Attributes tension and friction control the behavior of the spring bumper effect.