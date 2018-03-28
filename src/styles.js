import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  tooltipMargin: {
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  component: {
    position: 'absolute',
    bottom: 15,
    left: 15,
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
  },
  triangle: {
    position: 'absolute',
    top: -10,
    left: 22,
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
});
