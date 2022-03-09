import React, { ReactNode } from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  label: string | (() => ReactNode);
  containerStyle?: ViewStyle | ViewStyle[];
  touchableStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  testID?: string;
};

export const TooltipMenuItem = ({
  onPress,
  containerStyle,
  label,
  labelStyle,
  testID,
}: Props) => (
  <TouchableOpacity
    testID={testID}
    style={[styles.container, containerStyle]}
    onPress={onPress}
  >
    {typeof label === 'string' ? (
      <Text style={[labelStyle]}>{label}</Text>
    ) : (
      label()
    )}
  </TouchableOpacity>
);

TooltipMenuItem.defaultProps = {
  labelStyle: null,
  containerStyle: null,
  touchableStyle: null,
  testID: undefined,
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
