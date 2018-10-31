import React, {Component} from 'react';
import PropTypes from 'prop-types';

import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import {getMarkerHolderStyle, getMarkerStyle, getMarkerTextStyle} from '../helpers/marker_styles.js';


const K_HINT_HTML_DEFAULT_Z_INDEX = 1000000;
const K_SCALE_HOVER = 1;
const K_SCALE_TABLE_HOVER = 1;
const K_SCALE_NORMAL = 0.65;
const K_MIN_CONTRAST = 0.4;


export default class MyGreatPlaceWithStick extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: 0.2,
    };
  }

  componentDidMount() {
    this.props.increaseMarkersRenderCounter();
  }

  //willMount and WillUpdate are just to animate markers when we re-render them
  componentWillMount() {
    this.setState({
      scale: this.props.scale,
    });
  }

  //willMount and WillUpdate are just to animate markers when we re-render them
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.$hover != this.props.$hover || nextProps.showBallon != this.props.showBallon) {
      this.setState({
        scale: nextProps.$hover || nextProps.showBallon? K_SCALE_HOVER : nextProps.scale,
      });
    } else if (nextProps.lat != this.props.lat || nextProps.lng != this.props.lng) {
      let _this = this;
      setTimeout(function(){
        _this.setState({
          scale: _this.props.scale
        })
      }, 1000);

      this.setState({
        scale: 0.2,
      });
    }
  }

  calcMarkerMarkerStyle(scale, zIndexStyle, markerStyle, imageStyle) {
    const contrast = K_MIN_CONTRAST + (1 - K_MIN_CONTRAST) * Math.min(scale / K_SCALE_NORMAL, 1);

    return {
      transform: `scale(${scale} , ${scale})`,
      WebkitTransform: `scale(${scale} , ${scale})`,
      filter: `contrast(${contrast})`,
      WebkitFilter: `contrast(${contrast})`,
      ...markerStyle,
      ...zIndexStyle,
      ...imageStyle
    };
  }

  calcMarkerTextStyle(scale, markerTextStyle) {
    const K_MAX_COLOR_VALUE = 0;
    const K_MIN_COLOR_VALUE = 8;
    const colorV = Math.ceil(K_MIN_COLOR_VALUE + (K_MAX_COLOR_VALUE - K_MIN_COLOR_VALUE) * Math.min(scale / K_SCALE_NORMAL, 1));
    const colorHex = colorV.toString(16);
    const colorHTML = `#${colorHex}${colorHex}${colorHex}`;

    return {
      ...markerTextStyle,
      color: colorHTML
    };
  }

  render() {
    //getting styles for the wrapper
    let markerHolderStyle = getMarkerHolderStyle(this.props.size, this.props.origin);

    //getting marker style for the marker
    const markerStyle = getMarkerStyle(this.props.size, this.props.origin);

    //determining the scale level (it changes on hover)
    //let scale = this.props.$hover || this.props.showBallon? K_SCALE_HOVER : this.props.scale; //or K_SCALE_TABLE_HOVER

    let scale = this.state.scale;

    //z-index
    const zIndexStyle = {
      zIndex: Math.round(scale * 10000) - (this.props.showBallon ? 20 : 0) + (this.props.$hover ? K_HINT_HTML_DEFAULT_Z_INDEX : 0) // balloon
    };

    //styles for the text inside the marker
    const textStyleDef = getMarkerTextStyle();
    const textStyle = this.calcMarkerTextStyle(scale, textStyleDef);

    //calculating the final styles and animation for the marker
    const styleMarkerMarker = this.calcMarkerMarkerStyle(scale, zIndexStyle, markerStyle, null);

    return (
      <div style={markerHolderStyle} data-tip data-for={this.props.marker.area_name}>
        <div
          style={styleMarkerMarker}
          className={cx('map-marker__marker', this.props.imageClass)}>
          <div style={textStyle}>
            {this.props.rank}
          </div>
        </div>
        <ReactTooltip class="marker-tooltip" delayShow={500} id={this.props.marker.area_name} type='info' effect='solid'>
          <span>{this.props.marker.area_name}</span>
        </ReactTooltip>
      </div>
    );
  }
}

const defaultProps = {
    scale: K_SCALE_NORMAL,
    withText: false,
    size: {width: 62, height: 60},
    origin: {x: 15 / 62, y: 1},
    imageClass: 'map-marker__marker--big',
};

MyGreatPlaceWithStick.defaultProps = defaultProps;
