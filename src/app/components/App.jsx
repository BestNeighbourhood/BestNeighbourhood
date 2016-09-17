import React from 'react';
import '../../client/styles/style.scss';
import { AppBar } from 'material-ui';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

export default class App extends React.Component {

  constructor(props) {
    super(props);
  }
  
  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  render() {
    return (
      <div style={{width: '100%', height: '100%'}}>
        <AppBar
          title='Title'
          iconClassNameRight='muidocs-icon-navigation-expand-more'
        />
        <h2>Hello World!</h2>
        <div className='testClass'> </div>
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
