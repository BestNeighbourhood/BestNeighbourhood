import React from 'react';
import { List, ListItem, Subheader, Divider, IconButton } from 'material-ui';
import LocationSearching from 'material-ui/svg-icons/device/location-searching.js';

export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTxtField: '',
      passwordTxtField: '',
      emailTxtField: '',
    }
    this.moveToSelectedArea = this.moveToSelectedArea.bind(this);
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

  render() {
    //location search button
    let iconButton = (<IconButton><LocationSearching /></IconButton>);

    //always display the list in ascending order
    let sorted_neighbourhoods_list = this.props.neighbourhoods_names_centres.sort(function(a, b) {
      return a.area_s_cd - b.area_s_cd;
    });

    return (
      <div>
        <List>
          {sorted_neighbourhoods_list.map(neighbourhood => (
            <span key={neighbourhood.area_s_cd}>
              <ListItem
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
            </span>
          ))}
        </List>
      </div>
    );
  }
}
