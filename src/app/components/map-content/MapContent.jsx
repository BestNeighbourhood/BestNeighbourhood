import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import GoogleMap from 'google-map-react';
import MyGreatPlace from './my_great_place.jsx';


const defaultProps = {
  center: {lat: 59.938043, lng: 30.337157},
  zoom: 9,
  greatPlaceCoords: {lat: 59.724465, lng: 30.080121}
};

export default class MapContent extends Component {
  
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = shouldPureComponentUpdate;
    this.state = {
      map: undefined,
      maps: undefined,
      neighborhoodsDrawn: false,
    }
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
        //console.log(entry[0].lat + ' - ' + entry[0].lng);
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
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}>
        <MyGreatPlace lat={59.955413} lng={30.337844} text={'A'} /* Kreyser Avrora */ />
      </GoogleMap>
    );
  }
}

MapContent.defaultProps = defaultProps;