import React from 'react';
import ReactNative from 'react-native';

import PopoverTooltipItem from './PopoverTooltipItem';

const {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Easing,
  PanResponder
} = ReactNative;

const window = Dimensions.get('window');

class PopoverTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      opacity: new Animated.Value(0),
      tooltip_container_scale: new Animated.Value(0),
      button_component_container_scale: 1,
      tooptip_triangle_down: true,
      tooltip_triangle_left_margin: 0,
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
    const { onRequestClose } = this.props;

    return (
      <TouchableOpacity
        ref={component => this._component_wrapper = component}
        style={[componentWrapperStyle]}
        onLongPress={this.toggle.bind(this)}
        delayLongPress={100}
        activeOpacity={1.0}
        {...this._panResponder.panHandlers}
      >
        {buttonComponent}
        <Modal
          visible={this.state.isModalOpen}
          transparent
          onRequestClose={onRequestClose}
        >
          <Animated.View style={[styles.overlay, overlayStyle, {opacity:this.state.opacity}]}>
            <TouchableOpacity
              activeOpacity={1}
              focusedOpacity={1} style={{ flex: 1 }}
              onPress={this.toggle.bind(this)}
            >
              <Animated.View
                style={[
                  styles.tooltipContainer,
                  this.props.tooltipContainerStyle,
                  {
                    left: this.state.tooltip_container_x,
                    top: this.state.tooltip_container_y,
                    transform: [
                      {scale: this.state.tooltip_container_scale}
                    ]
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
                        let button_component_container_scale = this.state.tooltip_container_scale.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, this.props.buttonComponentExpandRatio? this.props.buttonComponentExpandRatio : 1.1]
                        });

                        this.setState({x:pageX, y:pageY, width:width, height:height, tooltip_container_x:tooltip_container_x, tooltip_container_y:tooltip_container_y, tooltip_triangle_down:tooltip_triangle_down, tooltip_triangle_left_margin:pageX+width/2-tooltip_container_x_final-10, button_component_container_scale:button_component_container_scale}, ()=>{
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
                        <PopoverTooltipItem
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
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[{position:'absolute', left:this.state.x, top:this.state.y, width:this.state.width, height:this.state.height, backgroundColor:'transparent', opacity:1}, {transform: [{scale: this.state.button_component_container_scale}]}]}>
            <TouchableOpacity
              onPress={this.toggle.bind(this)}
              activeOpacity={1.0}
            >
              {buttonComponent}
            </TouchableOpacity>
          </Animated.View>
        </Modal>
      </TouchableOpacity>
    );
  }

  _showZoomingInAnimation() {
    let tooltip_animation = Animated.timing(
      this.state.tooltip_container_scale,
      {
        toValue: 1,
        duration: this.props.timingConfig && this.props.timmingConfig.duration? this.props.timmingConfig.duration : 200
      }
    );
    if (this.props.animationType == 'spring') {
      tooltip_animation = Animated.spring(
        this.state.tooltip_container_scale,
        {
          toValue: 1,
          tension: this.props.springConfig && this.props.springConfig.tension? this.props.springConfig.tension : 100,
          friction: this.props.springConfig && this.props.springConfig.friction? this.props.springConfig.friction : 7
        }
      );
    }
    Animated.parallel([
      tooltip_animation,
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: this.props.opacityChangeDuration? this.props.opacityChangeDuration : 200
        }
      )
    ]).start();
  }
  _showZoomingOutAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.tooltip_container_scale,
        {
          toValue: 0,
          duration: this.props.opacityChangeDuration? this.props.opacityChangeDuration : 200
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: this.props.opacityChangeDuration? this.props.opacityChangeDuration : 200
        }
      )
    ]).start(this.toggleModal);
  }

  toggle() {
    this.state.isModalOpen? this.hideModal() : this.openModal();
  }
}

PopoverTooltip.propTypes = {
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
  animationType: React.PropTypes.oneOf([
    'timing',
    'spring'
  ]),
  onRequestClose: React.PropTypes.func
};

PopoverTooltip.defaultProps = {
  widthType: 'half',
  onRequestClose: () => {},
};

export default PopoverTooltip;

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
