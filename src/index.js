import React from 'react';
import ReactNative from 'react-native';

import TooltipMenuItem from './TooltipMenuItem';

const {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
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

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      opacity: new Animated.Value(0),
      componentHeight: 0,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  toggleModal() {
    const { isModalOpen } = this.state;
    this.setState({ isModalOpen: !isModalOpen });
  }

  openModal() {
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
  }

  hideModal() {
    Animated
      .timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 300,
        },
      )
      .start(this.toggleModal);
  }

  handleClick(onClickItem) {
    const method = this.state.isModalOpen ? this.hideModal : this.openModal;
    method();

    onClickItem();
  }

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
    } = this.props;
    const { isModalOpen } = this.state;
    const { onRequestClose } = this.props;
    const widthStyle = mapWight(widthType);

    return (
      <View style={styles.component}>
        <View
          style={[componentWrapperStyle]}
          onLayout={event => this.setState({ componentHeight: event.nativeEvent.layout.height })}
        >
          <TouchableOpacity onPress={this.openModal}>
            {buttonComponent}
          </TouchableOpacity>
        </View>
        <Modal
          visible={isModalOpen}
          transparent
          onRequestClose={onRequestClose}
        >
          <View style={[styles.overlay, overlayStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1} style={{ flex: 1 }}
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
                <TouchableOpacity onPress={isModalOpen ? this.hideModal : this.openModal}>
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

Tooltip.propTypes = {
  buttonComponent: React.PropTypes.node.isRequired,
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
      ]),
      onClick: React.PropTypes.func,
    }),
  ).isRequired,
  componentWrapperStyle: React.PropTypes.object,
  overlayStyle: React.PropTypes.object,
  labelContainerStyle: React.PropTypes.object,
  touchableItemStyle: React.PropTypes.object,
  labelStyle: React.PropTypes.object,
  widthType: React.PropTypes.oneOf([
    'auto',
    'half',
    'full',
  ]),
  onRequestClose: React.PropTypes.func,
};

Tooltip.defaultProps = {
  widthType: 'half',
  onRequestClose: () => {},
};

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
