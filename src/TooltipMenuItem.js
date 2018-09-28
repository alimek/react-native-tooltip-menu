import React from 'react';
import PropTypes from 'prop-types';
import ReactNative from 'react-native';

const {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const StylePropType = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.object,
]);

const TooltipMenuItem = ({ onPress, containerStyle, touchableStyle, label, labelStyle, testID }) => (
  <View
    style={containerStyle}
    testID={testID}
  >
    <TouchableOpacity style={[styles.container, touchableStyle]} onPress={onPress}>
      {
        typeof label === 'string' ?
          <Text style={[labelStyle]}>{label}</Text> :
          label()
      }
    </TouchableOpacity>
  </View>
);

TooltipMenuItem.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  containerStyle: StylePropType,
  touchableStyle: StylePropType,
  labelStyle: StylePropType,
  testID: PropTypes.string,
};

TooltipMenuItem.defaultProps = {
  labelStyle: null,
  containerStyle: null,
  touchableStyle: null,
  testID: undefined,
};

export default TooltipMenuItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
