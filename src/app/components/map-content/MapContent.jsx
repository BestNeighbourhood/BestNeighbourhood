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

    this.state = {
      neighborhoodsDrawn: false,
    }
  }

  _distanceToMouse = customDistanceToMouse;

  //getMap and getMapsare passed here manually once GoogleMapsAPI is ready
  //so we can start drawing polygons and render markers after that
  componentDidUpdate() {
    if(!this.state.neighborhoodsDrawn && this.props.getMap && this.props.getMaps) {

      let map = this.props.getMap();
      let maps = this.props.getMaps();

      if(maps != undefined && map != undefined) {
        for (var i = 0; i < this.props.neighbourhoodsData.length; i++) {  // 140
          var nbrhood = new maps.Polygon({
            paths: this.props.neighbourhoodsData[i].borders,
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

  calculateScale = (index) => {
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
        { /* first we draw neighbourhood borders
           * then we render initial markers
           * and then we sort the initial data in the app.jsx
          */
          this.state.neighborhoodsDrawn
          ? this.props.neighbourhoodsData.map((marker, index) => (
          <NeighbourhoodMarker
            scale={this.calculateScale(index)}
            showBallon={marker.area_s_cd == this.props.hoveredAreaCode}
            key={index}
            marker={marker}
            rank={index + 1}
            lat={marker.center[0]}
            lng={marker.center[1]}
            zIndex={1}
            increaseMarkersRenderCounter={this.props.increaseMarkersRenderCounter}
          />
        )) : null}
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
