import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const TooltipMenuItem = _ref => {
  let {
    onPress,
    containerStyle,
    touchableStyle,
    label,
    labelStyle,
    testID
  } = _ref;
  return /*#__PURE__*/React.createElement(View, {
    style: containerStyle,
    testID: testID
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    style: [styles.container, touchableStyle],
    onPress: onPress
  }, typeof label === 'string' ? /*#__PURE__*/React.createElement(Text, {
    style: [labelStyle]
  }, label) : label()));
};

TooltipMenuItem.defaultProps = {
  labelStyle: null,
  containerStyle: null,
  touchableStyle: null,
  testID: undefined
};
export default TooltipMenuItem;
const styles = StyleSheet.create({
  container: {
    padding: 10
  }
});
//# sourceMappingURL=TooltipMenuItem.js.map