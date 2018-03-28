// @flow
import React from 'react';
import ReactNative from 'react-native';

import styles from './styles';
import type {
  ReactNativeTooltipMenuPropTypes as PropTypes,
  ReactNativeTooltipMenuState as State,
} from './types';
import TooltipMenuItem from './TooltipMenuItem';

const {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
} = ReactNative;

const window = Dimensions.get('window');

const mapWight = (type) => {
  switch (type) {
    case 'half':
      return {
        width: window.width / 2,
      };
    case 'full':
      return {
        width: window.width * 0.9,
      };
    default:
      return null;
  }
};

class Tooltip extends React.Component<PropTypes, State> {
  state = {
    isOpen: false,
    opacity: new Animated.Value(0),
    componentHeight: 0,
  };

  toggleModal = () => this.setState({ isOpen: !this.state.isOpen });

  openModal = () => {
    this.toggleModal();
    Animated
      .timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 300,
        },
      )
      .start();
  };

  hideModal = () => {
    Animated
      .timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 300,
        },
      )
      .start(this.toggleModal);
  };

  handleClick = (onClickItem) => {
    const method = this.state.isOpen ? this.hideModal : this.openModal;
    method();

    onClickItem();
  };

  render() {
    const {
      buttonComponent,
      items,
      componentWrapperStyle,
      overlayStyle,
      widthType,
      labelContainerStyle,
      touchableItemStyle,
      labelStyle,
      modalButtonStyle,
    } = this.props;
    const { isOpen } = this.state;
    const { onRequestClose } = this.props;
    const widthStyle = mapWight(widthType);

    return (
      <View style={styles.component}>
        <TouchableOpacity
          onPress={this.openModal}
          onLayout={({ nativeEvent }) => this.setState({ componentHeight: nativeEvent.layout.height })}
        >
          {buttonComponent}
        </TouchableOpacity>
        <Modal
          visible={isOpen}
          transparent
          onRequestClose={onRequestClose}
        >
          <View style={[styles.overlay, overlayStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1}
              style={[{ flex: 1 }, modalButtonStyle]}
              onPress={this.hideModal}
            >
              <View style={[styles.component]}>
                <Animated.View
                  style={[
                    styles.tooltipContainer,
                    {
                      bottom: this.state.componentHeight + 10,
                    },
                    widthStyle,
                    { opacity: this.state.opacity },
                  ]}
                >
                  {items.map((item, index) => {
                    const classes = [labelContainerStyle];

                    if (index !== (items.length - 1)) {
                      classes.push(styles.tooltipMargin);
                    }

                    return (
                      <TooltipMenuItem
                        key={item.label}
                        label={item.label}
                        onPress={() => this.handleClick(item.onPress)}
                        containerStyle={classes}
                        touchableStyle={touchableItemStyle}
                        labelStyle={labelStyle}
                      />
                    );
                  })}
                </Animated.View>
                <Animated.View style={[styles.triangle, { opacity: this.state.opacity }]} />
                <TouchableOpacity onPress={isOpen ? this.hideModal : this.openModal}>
                  {buttonComponent}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Tooltip;
