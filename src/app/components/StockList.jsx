import React from 'react';
import { List, ListItem, Subheader } from 'material-ui';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import neighborhoods_borders from '../../data/neighborhoods_borders.js';
import MapsSatellite from 'material-ui/svg-icons/maps/satellite.js';

export default class StockList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTxtField: '',
      passwordTxtField: '',
      emailTxtField: '',
    }
    console.log(neighborhoods_borders[0].geometry.coordinates[0].length);
  }

  render() {
    return (
      <div>
        <List>
          <Subheader>Nested List Items</Subheader>
          {neighborhoods_borders.map(neighborhood => (
            <ListItem
              key={neighborhood.area_s_cd}
              primaryText={neighborhood.area_name}
              leftIcon={<MapsSatellite />}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem key={1} primaryText="Drafts" leftIcon={<ContentDrafts />} />,
              ]}
            />
          ))}
        </List>
      </div>
    );
  }
}
