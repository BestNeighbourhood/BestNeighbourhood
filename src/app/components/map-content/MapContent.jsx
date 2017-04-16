import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';
import NeighbourhoodMarker from './NeighbourhoodMarker.jsx';
import neighborhoods_borders from '../../../data/neighborhoods_borders.js';
import {customDistanceToMouse} from '../helpers/custom_distance.js';

const defaultProps = {
  center: [43.723736 ,-79.379555],
  zoom: 11,
  greatPlaceCoords: {lat: 43.6532, lng: -79.3832}
};

export default class MapContent extends Component {
  constructor(props) {
    super(props);

    var markers_info = [];
    for (var i = 0; i < this.props.neighborhoods_borders.length; i++) {  // 140
      var center = this.props.neighborhoods_borders[i].center.split(",");
      center = [parseFloat(center[0]), parseFloat(center[1])];

      markers_info.push({
        coordinate: this.props.neighborhoods_borders[i].geometry.coordinates[0][0],
        code: this.props.neighborhoods_borders[i].area_s_cd,
        center: center,
        name: this.props.neighborhoods_borders[i].area_name
      });
    }

    this.state = {
      neighborhoodsDrawn: false,
      markers_info: markers_info
    }
  }

  _distanceToMouse = customDistanceToMouse;

  componentDidUpdate() {
    if(!this.state.neighborhoodsDrawn && this.props.getMap && this.props.getMaps) {

      let map = this.props.getMap();
      let maps = this.props.getMaps();

      if(maps != undefined && map != undefined) {
        for (var i = 0; i < this.props.neighborhoods_borders.length; i++) {  // 140
          var entry = new Array();
          var _data = this.props.neighborhoods_borders[i].geometry.coordinates[0];

          for(var j = 0; j < _data.length; j++){ // 93
            entry.push({
              lat: _data[j][1],
              lng: _data[j][0],
            });
          }

          var nbrhood = new maps.Polygon({
            paths: entry,
            strokeColor: '#337ab7',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#def0f7',
            fillOpacity: 0.35
          });
          nbrhood.setMap(map);
        }

        this.setState({
          neighborhoodsDrawn: true,
        });
      }
    }
  }

  calculateScale = (index, code) => {
    return 0.65 - Math.round(index / 4) / 100;
  }

  render() {
    return (
      <GoogleMap
        resetBoundsOnResize = {true}
        onGoogleApiLoaded={({map, maps}) => this.props.setMaps(map, maps)}
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
        hoverDistance={30}
        distanceToMouse={this._distanceToMouse}
      >
        {this.state.markers_info.map((marker, index) => (
          <NeighbourhoodMarker
            scale={this.calculateScale(index, marker.code)}
            showBallon={marker.code == this.props.hoveredAreaCode}
            key={index}
            marker={marker}
            lat={marker.center[0]}
            lng={marker.center[1]}
            zIndex={1}
          />
        ))}
      </GoogleMap>
    );
  }
}

MapContent.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  greatPlaceCoords: PropTypes.object
};

MapContent.defaultProps = defaultProps;
