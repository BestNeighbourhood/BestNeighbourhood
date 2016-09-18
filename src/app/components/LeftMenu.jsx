import React from 'react';
import { List, ListItem, Subheader, Divider } from 'material-ui';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import neighborhoods_borders from '../../data/neighborhoods_borders.js';
import MapsSatellite from 'material-ui/svg-icons/maps/satellite.js';

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
    return (
      <div>
        <List>
          {neighborhoods_borders.map(neighborhood => (
            <span key={neighborhood.area_s_cd}>
              <ListItem
                primaryText={neighborhood.area_name.substring(0,neighborhood.area_name.indexOf('('))}
              />
              <Divider/>
            </span>
          ))}
        </List>
      </div>
    );
  }
}
