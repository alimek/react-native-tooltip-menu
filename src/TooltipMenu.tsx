import React, { createRef, ReactNode, useMemo, useState } from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  LayoutRectangle,
  useWindowDimensions,
  LayoutChangeEvent,
  TouchableOpacityProps,
} from 'react-native';
import { TooltipMenuItem } from './TooltipMenuItem';

type WidthType = 'auto' | 'half' | 'full';
type TrianglePosition = 'left' | 'center' | 'right';
type Props = {
  children: ReactNode;
  items: {
    label: string | (() => ReactNode);
    onPress: () => void;
    testID?: string;
  }[];
  style?: TouchableOpacityProps['style'];
  overlayStyle?: ViewStyle;
  labelContainerStyle?: ViewStyle;
  modalButtonStyle?: ViewStyle;
  labelStyle?: ViewStyle;
  widthType?: WidthType;
  onRequestClose?: () => void;
  trianglePosition?: TrianglePosition;
};

export const TooltipMenu = ({
  children,
  items,
  style,
  overlayStyle,
  widthType,
  labelContainerStyle,
  labelStyle,
  modalButtonStyle,
  onRequestClose,
  trianglePosition,
}: Props) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const buttonRef = createRef<TouchableOpacity>();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [componentPosition, setComponentPosition] = useState<LayoutRectangle>();
  const opacity = useMemo(() => new Animated.Value(0), []);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const openModal = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(toggleModal);
  };

  const calculateItemWith = () => {
    switch (widthType) {
      case 'half':
        return windowWidth / 2;
      case 'full':
        return windowWidth;
      default:
        return componentPosition?.width;
    }
  };

  const hideModal = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(toggleModal);
  };

  const handleClick = (onClickItem: Props['items'][0]['onPress']) => {
    const method = isModalOpen ? hideModal : openModal;
    method();

    onClickItem();
  };

  const calculatePosition = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    const height = event.nativeEvent.layout.height;
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y) => {
        setComponentPosition({
          x,
          y,
          width,
          height,
        });
      });
    }
  };

  return (
    <>
      <View style={style}>
        <TouchableOpacity
          onPress={openModal}
          ref={buttonRef}
          onLayout={(event) => calculatePosition(event)}
        >
          {children}
        </TouchableOpacity>
      </View>
      <Modal visible={isModalOpen} transparent onRequestClose={onRequestClose}>
        <View style={[styles.overlay, overlayStyle]} />
        <TouchableOpacity
          activeOpacity={1}
          style={[{ flex: 1 }, modalButtonStyle]}
          onPress={hideModal}
        >
          <View
            style={[
              styles.component,
              componentPosition && {
                top: componentPosition.y,
                left: componentPosition.x,
              },
            ]}
          >
            <TouchableOpacity onPress={isModalOpen ? hideModal : openModal}>
              {children}
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              { minWidth: calculateItemWith() },
              styles.tooltipContainer,
              componentPosition && {
                bottom: windowHeight - componentPosition.y + 10,
                left: componentPosition.x,
              },
              { opacity },
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

              return (
                <TooltipMenuItem
                  key={index}
                  label={item.label}
                  onPress={() => handleClick(item.onPress)}
                  containerStyle={classes}
                  labelStyle={labelStyle}
                  testID={item.testID}
                />
              );
            })}
          </Animated.View>
          <Animated.View
            style={[
              styles.triangle,
              { opacity },
              componentPosition && {
                top: componentPosition.y - 10,
              },
              componentPosition &&
                trianglePosition === 'center' && {
                  left: componentPosition.x + componentPosition.width / 2 - 10,
                },
              componentPosition &&
                trianglePosition === 'left' && {
                  left: componentPosition.x + 20,
                },
              componentPosition &&
                trianglePosition === 'right' && {
                  left: componentPosition.x + componentPosition.width - 40,
                },
            ]}
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

TooltipMenu.defaultProps = {
  widthType: 'auto',
  onRequestClose: () => {},
  trianglePosition: 'center',
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tooltipMargin: {
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  component: {
    position: 'absolute',
  },
  tooltipContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
  },
  triangle: {
    position: 'absolute',
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
