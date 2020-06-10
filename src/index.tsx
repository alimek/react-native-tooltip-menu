import * as React from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
} from 'react-native';

import TooltipMenuItem from './TooltipMenuItem';

const window = Dimensions.get('window');

export enum WidthType {
  AUTO = 'auto',
  HALF = 'half',
  FULL = 'full',
}

const mapWight = (type: WidthType) => {
  switch (type) {
    case WidthType.HALF:
      return {
        width: window.width / 2,
      };
    case WidthType.FULL:
      return {
        width: window.width * 0.9,
      };
    default:
      return null;
  }
};

interface Props {
  buttonComponent: React.ReactNode;
  items: {
    label: (() => React.ReactNode) | string;
    onPress: () => void;
    testID?: string;
  }[];
  componentWrapperStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  labelContainerStyle?: ViewStyle;
  modalButtonStyle?: ViewStyle;
  touchableItemStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  widthType: WidthType;
  onRequestClose?: () => void;
}

interface State {
  isModalOpen: boolean;
  opacity: Animated.Value;
  componentHeight: number;
  isButtonDisabled: boolean;
}

class Tooltip extends React.Component<Props, State> {
  static defaultProps = {
    widthType: WidthType.HALF,
    onRequestClose: () => {},
  };

  clickDelayed: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      isModalOpen: false,
      opacity: new Animated.Value(0),
      componentHeight: 0,
      isButtonDisabled: false,
    };
  }

  toggleModal = () => {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  };

  openModal = () => {
    if (this.clickDelayed) {
      return;
    }

    this.delayPressing();

    this.toggleModal();
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  hideModal = () => {
    if (this.clickDelayed) {
      return;
    }

    this.delayPressing();

    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(this.toggleModal);
  };

  delayPressing = () => {
    this.clickDelayed = true;
    this.setState({
      isButtonDisabled: true,
    });
    setTimeout(() => {
      this.clickDelayed = false;
      this.setState({
        isButtonDisabled: false,
      });
    }, 300);
  };

  handleClick = (onClickItem: () => void) => {
    const method = this.state.isModalOpen ? this.hideModal : this.openModal;
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
    const { isModalOpen, isButtonDisabled } = this.state;
    const { onRequestClose } = this.props;
    const widthStyle = mapWight(widthType);

    return (
      <View style={styles.component}>
        <View
          style={[componentWrapperStyle]}
          onLayout={(event) =>
            this.setState({ componentHeight: event.nativeEvent.layout.height })
          }
        >
          <TouchableOpacity
            disabled={isButtonDisabled}
            onPress={this.openModal}
          >
            {buttonComponent}
          </TouchableOpacity>
        </View>
        <Modal
          visible={isModalOpen}
          transparent
          animated={false}
          onRequestClose={onRequestClose}
        >
          <View style={[styles.overlay, overlayStyle]}>
            <TouchableOpacity
              activeOpacity={1}
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
                    const classes = [];

                    if (labelContainerStyle) {
                      classes.push(labelContainerStyle);
                    }

                    if (index !== items.length - 1) {
                      classes.push(styles.tooltipMargin);
                    }

                    const key =
                      typeof item.label === 'function'
                        ? `item-${index}`
                        : item.label;

                    return (
                      <TooltipMenuItem
                        key={key}
                        label={item.label}
                        onPress={() => this.handleClick(item.onPress)}
                        containerStyle={classes}
                        touchableStyle={touchableItemStyle}
                        labelStyle={labelStyle}
                        testID={item.testID}
                      />
                    );
                  })}
                </Animated.View>
                <Animated.View
                  style={[styles.triangle, { opacity: this.state.opacity }]}
                />
                <TouchableOpacity
                  disabled={isButtonDisabled}
                  onPress={isModalOpen ? this.hideModal : this.openModal}
                >
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

const styles = StyleSheet.create({
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
