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
    } = this.props;
    const { isModalOpen } = this.state;
    const widthStyle = mapWight(widthType);

    return (
      <View>
        <View style={[styles.component, styles.shadow, componentWrapperStyle]}>
          <TouchableOpacity onPress={isModalOpen ? this.hideModal : this.openModal}>
            {buttonComponent}
          </TouchableOpacity>
        </View>
        <Modal visible={isModalOpen} transparent>
          <View style={[styles.overlay, overlayStyle]}>
            <View style={[styles.component, styles.shadow]}>
              <Animated.View
                style={[
                  styles.tooltipContainer,
                  widthStyle,
                  { opacity: this.state.opacity },
                ]}
              >
                {items.map((item, index) => {
                  const { containerStyle, onPress, ...itemProps } = item;
                  const classes = [containerStyle];

                  if (index !== (items.length - 1)) {
                    classes.push(styles.tooltipMargin);
                  }

                  return (
                    <TooltipMenuItem
                      key={item.label}
                      {...itemProps}
                      onPress={() => this.handleClick(onPress)}
                      containerStyle={classes}
                    />
                  );
                })}
                <View style={styles.triangle}/>
              </Animated.View>
              <TouchableOpacity onPress={isModalOpen ? this.hideModal : this.openModal}>
                {buttonComponent}
              </TouchableOpacity>
            </View>
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
      ]).isRequired,
      onClick: React.PropTypes.func,
    }),
  ).isRequired,
  componentWrapperStyle: React.PropTypes.object,
  overlayStyle: React.PropTypes.object,
  widthType: React.PropTypes.oneOf([
    'auto',
    'half',
    'full',
  ]),
};

Tooltip.defaultProps = {
  widthType: 'half',
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
    borderRadius: 30,
  },
  shadow: {
    shadowColor: '#A6A6A6',
    shadowOpacity: 0.2,
    shadowRadius: 0.1,
    shadowOffset: {
      height: 3,
      width: 0,
    },
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
  },
  triangle: {
    position: 'absolute',
    bottom: -10,
    marginLeft: 22,
    width: 0,
    height: 0,
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

