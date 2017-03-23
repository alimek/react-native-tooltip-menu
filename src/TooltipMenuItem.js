import React from 'react';
import ReactNative from 'react-native';

const {
  Text,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const StylePropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
]);

const TooltipMenuItem = ({ onPress, containerStyle, label, labelStyle }) => (
  <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
    {
      typeof label === 'string' ?
        <Text style={[labelStyle]}>{label}</Text> :
        label()
    }

  </TouchableOpacity>
);

TooltipMenuItem.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  containerStyle: StylePropType,
  labelStyle: StylePropType,
};

TooltipMenuItem.defaultProps = {
  labelStyle: null,
  containerStyle: null,
};

export default TooltipMenuItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
