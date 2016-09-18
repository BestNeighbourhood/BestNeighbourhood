import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {
  greatPlaceStyle,
  greatPlaceCircleStyle, greatPlaceCircleStyleHover,
  greatPlaceStickStyle, greatPlaceStickStyleHover, greatPlaceStickStyleShadow} from './my_great_place_with_hover_styles.js';

export default class MyGreatPlaceWithStick extends Component {
  constructor(props) {
    super(props);
      this.shouldComponentUpdate = shouldPureComponentUpdate.bind(this);
  }

  render() {
    const {text, zIndex} = this.props;
    const K_CIRCLE_SIZE = 30;
    const K_STICK_SIZE = 10;
    const K_STICK_WIDTH = 3;
    const style = {
      // initially any map object has left top corner at lat lng coordinates
      // it's on you to set object origin to 0,0 coordinates
      position: 'absolute',
      width: K_CIRCLE_SIZE,
      height: K_CIRCLE_SIZE + K_STICK_SIZE,
      left: -K_CIRCLE_SIZE / 2,
      top: -(K_CIRCLE_SIZE + K_STICK_SIZE),
      zIndex: this.props.$hover ? 1000 : zIndex
    };

    const circleStyle = this.props.$hover ? greatPlaceCircleStyleHover : greatPlaceCircleStyle;
    const stickStyle = this.props.$hover ? greatPlaceStickStyleHover : greatPlaceStickStyle;

    return (
       <div style={style}>
          <div style={greatPlaceStickStyleShadow} />
          <div style={circleStyle}>
            {text}
          </div>
          <div style={stickStyle} />
       </div>
    );
  }
}

MyGreatPlaceWithStick.propTypes = {
  // GoogleMap pass $hover props to hovered components
  // to detect hover it uses internal mechanism, explained in x_distance_hover example
  $hover: PropTypes.bool,
  text: PropTypes.string,
  zIndex: PropTypes.number
};
