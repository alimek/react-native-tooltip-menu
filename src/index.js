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
  Text,
  Easing
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
      componentHeight: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      tooltip_container_scale: new Animated.Value(0),
      base_container_scale: 1,
      tooptip_triangle_down: true,
      tooltip_triangle_left_margin: 0,
      tooltip_container_dimension: {width: 0, height:0},
      tooltip_container_opacity: 0,
      tooltip_overlay_opacity: 0,
      will_popup: false
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
    this.setState({will_popup: true});
    this.toggleModal();
    this.props.onOpenTooltipMenu && this.props.onOpenTooltipMenu();
  }

  hideModal() {
    this.setState({will_popup: false});
    this._showZoomingOutAnimation();
    this.props.onCloseTooltipMenu && this.props.onCloseTooltipMenu();
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
      labelStyle,
    } = this.props;
    const { isModalOpen } = this.state;
    const { onRequestClose } = this.props;
    const widthStyle = mapWight(widthType);

    return (
      <TouchableOpacity
        ref={component => this._component_wrapper = component}
        style={[componentWrapperStyle]}
        onLongPress={isModalOpen? this.hideModal : this.openModal}
        delayLongPress={100}
        activeOpacity={1.0}
        onLayout={event => this.setState({ componentHeight: event.nativeEvent.layout.height })}
      >
        {buttonComponent}
        <Modal
          visible={isModalOpen}
          transparent
          onRequestClose={onRequestClose}
        >
          <Animated.View style={[styles.overlay, overlayStyle, {opacity:this.state.tooltip_overlay_opacity}]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1} style={{ flex: 1 }}
              onPress={isModalOpen ? this.hideModal : this.openModal}
            >
              <Animated.View
                style={[
                  styles.tooltipContainer,
                  {
                    left: this.state.tooltip_container_x,
                    top: this.state.tooltip_container_y,
                    transform: [
                      {scale: this.state.tooltip_container_scale}
                    ],
                    opacity: this.state.tooltip_container_opacity
                  }
                ]}
              >

                <View
                  onLayout={ev => {
                    let tooltip_container_width = ev.nativeEvent.layout.width, tooltip_container_height = ev.nativeEvent.layout.height;
                    if (this.state.will_popup && tooltip_container_width > 0 && tooltip_container_height > 0) {
                      this._component_wrapper.measure((x, y, width, height, pageX, pageY) => {
                        let tooltip_container_x_final=pageX+tooltip_container_width+(width-tooltip_container_width)/2>window.width? window.width-tooltip_container_width : pageX+(width-tooltip_container_width)/2;
                        let tooltip_container_y_final=pageY-tooltip_container_height-20;
                        let tooltip_triangle_down=true;
                        if (pageY-tooltip_container_height-20<0) {
                          tooltip_container_y_final=pageY+height+20;
                          tooltip_triangle_down=false;
                        }
                        let tooltip_container_x = this.state.tooltip_container_scale.interpolate({
                          inputRange: [0, 1],
                          outputRange: [tooltip_container_x_final, tooltip_container_x_final]
                        });
                        let tooltip_container_y = this.state.tooltip_container_scale.interpolate({
                          inputRange: [0, 1],
                          outputRange: [tooltip_container_y_final+tooltip_container_height/2+20, tooltip_container_y_final]
                        });
                        let tooltip_container_opacity = this.state.tooltip_container_scale.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        });
                        let tooltip_overlay_opacity = this.state.tooltip_container_scale.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        });
                        let base_container_scale = this.state.tooltip_container_scale.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.1]
                        });

                        this.setState({x:pageX, y:pageY, width:width, height:height, tooltip_container_x:tooltip_container_x, tooltip_container_y:tooltip_container_y, tooltip_triangle_down:tooltip_triangle_down, tooltip_triangle_left_margin:pageX+width/2-tooltip_container_x_final-10, tooltip_container_opacity:tooltip_container_opacity, tooltip_overlay_opacity:tooltip_overlay_opacity, base_container_scale:base_container_scale}, ()=>{
                          this._showZoomingInAnimation();
                        });
                      });

                      this.setState({will_popup:false});
                    }
                  }}
                  style={[{backgroundColor:'transparent', alignItems:'flex-start'}]}
                >
                  {this.state.tooltip_triangle_down
                  ? null
                  : <View style={[styles.triangle_up, {marginLeft:this.state.tooltip_triangle_left_margin}]} />
                  }
                  <View style={{borderRadius:5, backgroundColor:'white', alignSelf:'stretch'}}>
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
                          labelStyle={labelStyle}
                        />
                      );
                    })}
                  </View>
                  {this.state.tooltip_triangle_down
                  ? <View style={[styles.triangle_down, {marginLeft:this.state.tooltip_triangle_left_margin}]} />
                  : null
                  }
                </View>
              </Animated.View>
              <Animated.View style={[{position:'absolute', left:this.state.x, top:this.state.y, width:this.state.width, height:this.state.height, backgroundColor:'transparent'}, {transform: [{scale: this.state.base_container_scale}]}]}>
                <TouchableOpacity
                  onPress={isModalOpen ? this.hideModal : this.openModal}
                  activeOpacity={1.0}
                >
                  {buttonComponent}
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </TouchableOpacity>
    );
  }

  _showZoomingInAnimation() {
    Animated.spring(
      this.state.tooltip_container_scale,
      {
        toValue: 1,
        tension: 100,
        friction: 7
      }
    ).start();
  }
  _showZoomingOutAnimation() {
    Animated.timing(
      this.state.tooltip_container_scale,
      {
        toValue: 0,
        duration: 200
      }
    ).start(this.toggleModal);
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
  tooltipContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  triangle_down: {
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
  triangle_up: {
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
});
