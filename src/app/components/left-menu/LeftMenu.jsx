import React from 'react';
import { List, ListItem, Subheader, Divider, IconButton } from 'material-ui';
import LocationSearching from 'material-ui/svg-icons/device/location-searching.js';
import FlipMove from 'react-flip-move';

export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTxtField: '',
      passwordTxtField: '',
      emailTxtField: '',

      sortedNeighbourhoods: [],
    }
    this.moveToSelectedArea = this.moveToSelectedArea.bind(this);
  }

  componentWillMount() {
    //always display the list in ascending order
    let sorted_neighbourhoods_list = this.props.neighbourhoods_names_centres.sort(function(a, b) {
      return a.area_s_cd - b.area_s_cd;
    });
    this.setState({
      sortedNeighbourhoods: sorted_neighbourhoods_list,
    });
  }

  componentDidMount() {
    let _this = this;
    setTimeout(function(){
      _this.setState({
        sortedNeighbourhoods: _this.state.sortedNeighbourhoods.sort(function(a, b) {
          return Math.floor((Math.random() * 10) + 1) % 2 ? a.area_s_cd + b.area_s_cd : a.area_s_cd - b.area_s_cd; })
      })
    }, 3000);
  }

  moveToSelectedArea(center, zoom) {
    let map = this.props.getMap();
    let maps = this.props.getMaps();

    if(maps != undefined && map != undefined) {

      //getting an actual coordinate from the string
      let _center = center.split(",");
      let lat = parseFloat(_center[0]);
      let lng = parseFloat(_center[1]);

      map.panTo(new maps.LatLng(lat, lng));
      map.setZoom(zoom);
    }
  }

  handleMouseEnter = (neighbourhood_num) => {
    this.props.handleHovered(neighbourhood_num);
  }

  handleMouseLeave = () => {
    this.props.handleHovered(undefined);
  }

  render() {



    return (
      <div>
        <List>
          <FlipMove duration={1500} easing="ease-out">
          {this.state.sortedNeighbourhoods.map(neighbourhood => (
              <div key={neighbourhood.area_s_cd}>
                <ListItem
                  onMouseEnter={this.handleMouseEnter.bind(null, neighbourhood.area_s_cd)}
                  onMouseLeave={this.handleMouseLeave}
                  primaryText={neighbourhood.area_name}
                  rightIconButton={(
                    <IconButton onClick={this.moveToSelectedArea.bind(null, neighbourhood.center, neighbourhood.zoom)}>
                      <LocationSearching />
                    </IconButton>
                  )}
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{margin: '0', left: '0', padding: '6px', width: 'calc(100% - 12px)', height: 'calc(100% - 12px)'}}>
                      <foreignObject width="100%" height="100%">
                        <p className="circle">
                          {neighbourhood.area_s_cd}
                        </p>
                      </foreignObject>
                    </svg>
                  }
                />
                <Divider/>
              </div>
            ))}
          </FlipMove>
        </List>
      </div>
    );
  }
}
