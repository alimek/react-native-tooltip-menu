// @flow

import React from 'react';

export type ReactNativeTooltipMenuPropTypes = {
  buttonComponent: React.Node,
  items: PropTypes.arrayOf(PropTypes.shape({
                                             label: PropTypes.oneOfType([
                                                                          PropTypes.string,
                                                                          PropTypes.func,
                                                                          ]),
                                             onClick: PropTypes.func,
                                           })).isRequired,
  componentWrapperStyle?: object,
  overlayStyle?: object,
  labelContainerStyle?: object,
  touchableItemStyle?: object,
  labelStyle?: object,
  widthType?: PropTypes.oneOf([
                               'auto',
                               'half',
                               'full',
                               ]),
  onRequestClose?: Function,
};

export type ReactNativeTooltipMenuState = {
  isOpen: boolean,
  opacity: any,
  componentHeight: number,
};
