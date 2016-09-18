/*
 * GoogleMap distance hover usage example
 */
import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
import MyGreatPlaceWithStick from './my_great_place_with_stick.jsx';

import {K_CIRCLE_SIZE, K_STICK_SIZE} from './my_great_place_with_hover_styles.js';

const defaultProps = {
  center: [43.6532 ,-79.3832],
  zoom: 9,
  greatPlaceCoords: {lat: 43.6532, lng: -79.3832}
};

export default class MapContent extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldPureComponentUpdate.bind(this);
    this._distanceToMouse = this._distanceToMouse.bind(this);
    this.state = {
      map: undefined,
      maps: undefined,
      neighborhoodsDrawn: false,
    }
  }

  _distanceToMouse(markerPos, mousePos, markerProps) {
    const x = markerPos.x;
    // because of marker non symmetric,
    // we transform it central point to measure distance from marker circle center
    // you can change distance function to any other distance measure
    const y = markerPos.y - K_STICK_SIZE - K_CIRCLE_SIZE / 2;

    // and i want that hover probability on markers with text === 'A' be greater than others
    // so i tweak distance function (for example it's more likely to me that user click on 'A' marker)
    // another way is to decrease distance for 'A' marker
    // this is really visible on small zoom values or if there are a lot of markers on the map
    const distanceKoef = markerProps.text !== 'A' ? 1.5 : 1;

    // it's just a simple example, you can tweak distance function as you wish
    return distanceKoef * Math.sqrt((x - mousePos.x) * (x - mousePos.x) + (y - mousePos.y) * (y - mousePos.y));
  }

  componentDidMount() {
    console.log("componentDidMount");
    console.log(this.state);
  }

  componentDidUpdate() {
    console.log(this.state);
    console.log("componentdidupdate");
    if(!this.state.neighborhoodsDrawn && this.state.maps != undefined && this.state.map != undefined) {
      for (var i = 0; i < this.props.neighborhoods_borders.length; i++) {  // 140
        var entry = new Array();
        var _data = this.props.neighborhoods_borders[i].geometry.coordinates[0];
        for(var j = 0; j < _data.length; j++){ // 93
          entry.push({
            lat: _data[j][1],
            lng: _data[j][0],
          });
        }
        console.log(entry[0].lat + ' - ' + entry[0].lng);
        var nbrhood = new this.state.maps.Polygon({
          paths: entry,
          strokeColor: '#ff4d4d',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#ffe6e6',
          fillOpacity: 0.35
        });
        nbrhood.setMap(this.state.map);
      }
    }
  }

  render() {
    return (
      <GoogleMap
        onGoogleApiLoaded={({map, maps}) => this.setState({'map': map, 'maps': maps})}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{
          key: 'AIzaSyDvdYfKEjZJZ_H1zV6Cl4ixBaqIc0BPD-0',
          language: 'en',
        }}
        // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
        center={this.props.center}
        zoom={this.props.zoom}
        // instead of css hover (which sometimes is bad for map markers) (bad means inability to hover on markers placed under other markers)
        // you can use internal GoogleMap component hover algorithm
        // hoverDistance - is is the threshold value for distanceToMouse function,
        // marker gets $hover=true property if it has minimal distanceToMouse(...args) result
        // and distanceToMouse(...args) < hoverDistance
        hoverDistance={K_CIRCLE_SIZE / 2}
        distanceToMouse={this._distanceToMouse}
        >
        <MyGreatPlaceWithStick lat={43.6632} lng={-79.3932} text={'A'} zIndex={2} /* Kreyser Avrora */ />
        <MyGreatPlaceWithStick {...this.props.greatPlaceCoords} text={'B'} zIndex={1} /* place near Kreyser Avrora */ />
      </GoogleMap>
    );
  }
}

MapContent.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  greatPlaceCoords: PropTypes.any
};

MapContent.defaultProps = defaultProps;
