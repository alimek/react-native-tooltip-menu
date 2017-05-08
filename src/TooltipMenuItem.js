import React from 'react';
import ReactNative from 'react-native';

const {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} = ReactNative;

const StylePropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
]);

const TooltipMenuItem = ({ onPress, containerStyle, label, labelStyle }) => (
  <View style={containerStyle}>
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {
        typeof label === 'string' ?
          <Text style={[labelStyle]}>{label}</Text> :
          label()
      }
    </TouchableOpacity>
  </View>
);

TooltipMenuItem.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  label: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func,
  ]).isRequired,
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
