// @flow

import type {
  StyleObj,
} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

import * as React from 'react';
import {
  View,
  Modal,
  Animated,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Easing,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import PopoverTooltipItem, { type Label, labelPropType }
  from './PopoverTooltipItem';

const window = Dimensions.get('window');

type Props = {
  buttonComponent: React.Node,
  buttonComponentExpandRatio: number,
  items: $ReadOnlyArray<{ +label: Label, onPress: () => void }>,
  componentWrapperStyle?: StyleObj,
  overlayStyle?: StyleObj,
  tooltipContainerStyle?: StyleObj,
  labelContainerStyle?: StyleObj,
  labelSeparatorColor: string,
  labelStyle?: StyleObj,
  setBelow: bool,
  animationType?: "timing" | "spring",
  onRequestClose: () => void,
  triangleOffset: number,
  delayLongPress: number,
  onOpenTooltipMenu?: () => void,
  onCloseTooltipMenu?: () => void,
  onPress?: () => void,
  componentContainerStyle?: StyleObj,
  timingConfig?: { duration?: number },
  springConfig?: { tension?: number, friction?: number },
  opacityChangeDuration?: number,
};
type State = {
  isModalOpen: bool,
  x: number,
  y: number,
  width: number,
  height: number,
  opacity: Animated.Value,
  tooltipContainerScale: Animated.Value,
  buttonComponentContainerScale: number | Animated.Interpolation,
  tooltipTriangleDown: bool,
  tooltipTriangleLeftMargin: number,
  triangleOffset: number,
  willPopUp: bool,
  oppositeOpacity: ?Animated.Interpolation,
  tooltipContainerX: ?Animated.Interpolation,
  tooltipContainerY: ?Animated.Interpolation,
  buttonComponentOpacity: number,
};
class PopoverTooltip extends React.PureComponent<Props, State> {

  static propTypes = {
    buttonComponent: PropTypes.node.isRequired,
    buttonComponentExpandRatio: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: labelPropType.isRequired,
      onPress: PropTypes.func.isRequired,
    })).isRequired,
    componentWrapperStyle: ViewPropTypes.style,
    overlayStyle: ViewPropTypes.style,
    tooltipContainerStyle: ViewPropTypes.style,
    labelContainerStyle: ViewPropTypes.style,
    labelSeparatorColor: PropTypes.string,
    labelStyle: Text.propTypes.style,
    setBelow: PropTypes.bool,
    animationType: PropTypes.oneOf([ "timing", "spring" ]),
    onRequestClose: PropTypes.func,
    triangleOffset: PropTypes.number,
    delayLongPress: PropTypes.number,
    onOpenTooltipMenu: PropTypes.func,
    onCloseTooltipMenu: PropTypes.func,
    onPress: PropTypes.func,
    componentContainerStyle: ViewPropTypes.style,
    timingConfig: PropTypes.object,
    springConfig: PropTypes.object,
    opacityChangeDuration: PropTypes.number,
  };
  static defaultProps = {
    buttonComponentExpandRatio: 1.0,
    labelSeparatorColor: "#E1E1E1",
    onRequestClose: () => {},
    setBelow: false,
    delayLongPress: 100,
    triangleOffset: 0,
  };
  wrapperComponent: ?TouchableOpacity;

  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      opacity: new Animated.Value(0),
      tooltipContainerScale: new Animated.Value(0),
      buttonComponentContainerScale: 1,
      tooltipTriangleDown: !props.setBelow,
      tooltipTriangleLeftMargin: 0,
      triangleOffset: props.triangleOffset,
      willPopUp: false,
      oppositeOpacity: undefined,
      tooltipContainerX: undefined,
      tooltipContainerY: undefined,
      buttonComponentOpacity: 0,
    };
  }

  componentWillMount() {
    const newOppositeOpacity = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    this.setState({ oppositeOpacity: newOppositeOpacity });
  }

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  openModal = () => {
    this.setState({ willPopUp: true });
    this.toggleModal();
    this.props.onOpenTooltipMenu && this.props.onOpenTooltipMenu();
  }

  hideModal = () => {
    this.setState({ willPopUp: false });
    this.showZoomingOutAnimation();
    this.props.onCloseTooltipMenu && this.props.onCloseTooltipMenu();
  }

  onPressItem = (userCallback: () => void) => {
    this.toggle();
    userCallback();
  }

  onInnerContainerLayout = (
    event: { nativeEvent: { layout: { height: number, width: number } } },
  ) => {
    const tooltipContainerWidth = event.nativeEvent.layout.width;
    const tooltipContainerHeight = event.nativeEvent.layout.height;
    if (
      !this.state.willPopUp ||
      tooltipContainerWidth === 0 ||
      tooltipContainerHeight === 0
    ) {
      return;
    }

    const componentWrapper = this.wrapperComponent;
    invariant(componentWrapper, "should be set");
    componentWrapper.measure((x, y, width, height, pageX, pageY) => {
      const fullWidth = pageX + tooltipContainerWidth
        + (width - tooltipContainerWidth) / 2;
      const tooltipContainerX_final = fullWidth > window.width
        ? window.width - tooltipContainerWidth
        : pageX + (width - tooltipContainerWidth) / 2;
      let tooltipContainerY_final = this.state.tooltipTriangleDown
        ? pageY - tooltipContainerHeight - 20
        : pageY + tooltipContainerHeight - 20;
      let tooltipTriangleDown = this.state.tooltipTriangleDown;
      if (pageY - tooltipContainerHeight - 20 < 0) {
        tooltipContainerY_final = pageY + height + 20;
        tooltipTriangleDown = false;
      }
      if (pageY + tooltipContainerHeight + 80 > window.height) {
        tooltipContainerY_final = pageY - tooltipContainerHeight - 20;
        tooltipTriangleDown = true;
      }
      const tooltipContainerX = this.state.tooltipContainerScale.interpolate({
        inputRange: [0, 1],
        outputRange: [tooltipContainerX_final, tooltipContainerX_final],
      });
      const tooltipContainerY = this.state.tooltipContainerScale.interpolate({
        inputRange: [0, 1],
        outputRange: [
          tooltipContainerY_final + tooltipContainerHeight / 2 + 20,
          tooltipContainerY_final,
        ],
      });
      const buttonComponentContainerScale =
        this.state.tooltipContainerScale.interpolate({
          inputRange: [0, 1],
          outputRange: [1, this.props.buttonComponentExpandRatio],
        });
      const tooltipTriangleLeftMargin =
        pageX + width / 2 - tooltipContainerX_final - 10;
      this.setState(
        {
          x: pageX,
          y: pageY,
          width,
          height,
          tooltipContainerX,
          tooltipContainerY,
          tooltipTriangleDown,
          tooltipTriangleLeftMargin,
          buttonComponentContainerScale,
          buttonComponentOpacity: 1,
        },
        this.showZoomingInAnimation,
      );
    });
    this.setState({ willPopUp: false });
  }

  render() {
    const tooltipContainerStyle = {
      left: this.state.tooltipContainerX,
      top: this.state.tooltipContainerY,
      transform: [
        { scale: this.state.tooltipContainerScale },
      ],
    };

    const posYDistance = Platform.OS === 'ios' ? this.state.y : 0;

    const items = this.props.items.map((item, index) => {
      const classes = [ this.props.labelContainerStyle ];

      if (index !== this.props.items.length - 1) {
        classes.push([
          styles.tooltipMargin,
          { borderBottomColor: this.props.labelSeparatorColor },
        ]);
      }

      return (
        <PopoverTooltipItem
          key={index}
          label={item.label}
          onPressUserCallback={item.onPress}
          onPress={this.onPressItem}
          containerStyle={classes}
          labelStyle={this.props.labelStyle}
        />
      );
    });

    const labelContainerStyle = this.props.labelContainerStyle;
    const borderStyle =
      labelContainerStyle && labelContainerStyle.backgroundColor
        ? { borderTopColor: labelContainerStyle.backgroundColor }
        : null;
    let triangleDown = null;
    let triangleUp = null;
    if (this.state.tooltipTriangleDown) {
      triangleDown = (
        <View style={[
          styles.triangleDown,
          {
            marginLeft: this.state.tooltipTriangleLeftMargin,
            left: this.state.triangleOffset,
          },
          borderStyle,
        ]} />
      );
    } else {
      triangleUp = (
        <View style={[
          styles.triangleUp,
          {
            marginLeft: this.state.tooltipTriangleLeftMargin,
            left: this.state.triangleOffset,
          },
          borderStyle,
        ]} />
      );
    }

    return (
      <TouchableOpacity
        ref={this.wrapperRef}
        style={this.props.componentWrapperStyle}
        onPress={this.props.onPress}
        onLongPress={this.toggle}
        delayLongPress={this.props.delayLongPress}
        activeOpacity={1.0}
      >
        <Animated.View style={[
          { opacity: this.state.oppositeOpacity },
          this.props.componentContainerStyle,
        ]}>
          {this.props.buttonComponent}
        </Animated.View>
        <Modal
          visible={this.state.isModalOpen}
          onRequestClose={this.props.onRequestClose}
          transparent
        >
          <Animated.View style={[
            styles.overlay,
            this.props.overlayStyle,
            { opacity: this.state.opacity },
          ]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1}
              style={styles.button}
              onPress={this.toggle}
            >
              <Animated.View
                style={[
                  styles.tooltipContainer,
                  this.props.tooltipContainerStyle,
                  tooltipContainerStyle,
                ]}
              >
                <View
                  onLayout={this.onInnerContainerLayout}
                  style={styles.innerContainer}
                >
                  {triangleUp}
                  <View style={[
                    styles.allItemContainer,
                    this.props.tooltipContainerStyle,
                  ]}>
                    {items}
                  </View>
                  {triangleDown}
                </View>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{
            position: 'absolute',
            left: this.state.x,
            top: posYDistance,
            width: this.state.width,
            height: this.state.height,
            backgroundColor: 'transparent',
            opacity: this.state.buttonComponentOpacity, // At the first frame, the button will be rendered
                                                        // in the top-left corner. So we dont render it
                                                        // until its position has been calculated.
            transform: [
              { scale: this.state.buttonComponentContainerScale },
            ],
          }}>
            <TouchableOpacity
              onPress={this.toggle}
              activeOpacity={1.0}
            >
              {this.props.buttonComponent}
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </TouchableOpacity>
    );
  }

  wrapperRef = (wrapperComponent: ?TouchableOpacity) => {
    this.wrapperComponent = wrapperComponent;
  }

  showZoomingInAnimation = () => {
    let tooltipAnimation = Animated.timing(
      this.state.tooltipContainerScale,
      {
        toValue: 1,
        duration: this.props.timingConfig && this.props.timingConfig.duration
          ? this.props.timingConfig.duration
          : 200,
      }
    );
    if (this.props.animationType == 'spring') {
      tooltipAnimation = Animated.spring(
        this.state.tooltipContainerScale,
        {
          toValue: 1,
          tension: this.props.springConfig && this.props.springConfig.tension
            ? this.props.springConfig.tension
            : 100,
          friction: this.props.springConfig && this.props.springConfig.friction
            ? this.props.springConfig.friction
            : 7,
        },
      );
    }
    Animated.parallel([
      tooltipAnimation,
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: this.props.opacityChangeDuration
            ? this.props.opacityChangeDuration
            : 200,
        },
      ),
    ]).start();
  }

  showZoomingOutAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.tooltipContainerScale,
        {
          toValue: 0,
          duration: this.props.opacityChangeDuration
            ? this.props.opacityChangeDuration
            : 200,
        },
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: this.props.opacityChangeDuration
            ? this.props.opacityChangeDuration
            : 200,
        },
      ),
    ]).start(this.toggleModal);
  }

  toggle = () => {
    if (this.state.isModalOpen) {
      this.hideModal();
    } else {
      this.openModal();
    }
  }

}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  innerContainer: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start'
  },
  tooltipMargin: {
    borderBottomWidth: 1,
  },
  tooltipContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  triangleDown: {
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
  triangleUp: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderBottomColor: 'white',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  button: {
    flex: 1,
  },
  allItemContainer: {
    borderRadius: 5,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
});

export default PopoverTooltip;
