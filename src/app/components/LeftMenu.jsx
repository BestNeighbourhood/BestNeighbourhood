import React from 'react';
import { List, ListItem, Subheader, Divider, IconButton } from 'material-ui';
import LocationSearching from 'material-ui/svg-icons/device/location-searching.js';
import PanoramaFishEye from 'material-ui/svg-icons/image/panorama-fish-eye.js';

export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTxtField: '',
      passwordTxtField: '',
      emailTxtField: '',
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
          {sorted_neighbourhoods_list.map(neighborhood => (
            <span key={neighborhood.area_s_cd}>
              <ListItem
                primaryText={neighborhood.area_name}
                rightIconButton={iconButton}
                leftIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" style={{margin: '6px'}}>
                    <foreignObject>
                      <p className="octagon">
                        {neighborhood.area_s_cd}
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
