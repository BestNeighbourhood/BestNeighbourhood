import React from 'react';
import '../../client/styles/style.scss';
import { AppBar, FlatButton  } from 'material-ui';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LoginDialog from './LoginDialog.jsx';
import SignupDialog from './SignupDialog.jsx';
import LeftMenu from './left-menu/LeftMenu.jsx';
import MapContent from './map-content/MapContent.jsx';
import neighborhoods_borders from '../../data/neighborhoods_borders.js';
import PreferencesList from './PreferencesList.jsx';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loginDialog: false,
      signupDialog: false,
      leftMenuOpen: true,
      map: undefined,
      maps: undefined,

      //set this to true and send to MapContent to identify that map and maps have been set
      //and we can start rendering neighbourhoods' borders
      updateMaps: false,
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.menuClickHandler = this.menuClickHandler.bind(this);
    this.setMaps = this.setMaps.bind(this);
    this.getMaps = this.getMaps.bind(this);
    this.getMap = this.getMap.bind(this);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  closeHandler() {
    this.setState({
      loginDialog: false,
      signupDialog: false,
    });
  }

  handleLogin() {
    console.log('handle login');
    this.setState({
      loginDialog: true,
      signupDialog: false,
    });
  };

  handleSignup() {
    console.log('handle signup');
    this.setState({
      loginDialog: false,
      signupDialog: true,
    });
  };

  setMaps(map, maps) {
    this.setState({
      map: map,
      maps: maps,
      updateMaps: true,
    });
  }

  getMaps() {
    return this.state.maps;
  }

  getMap() {
    return this.state.map;
  }

  getRightButtons() {
    var rightButtonsStyle = {
      'height': '40px',
      'marginRight': '5px',
      'marginLeft': '5px',
      'marginTop': '4px',
      'marginBottom': '4px',
    };
    return (
      <div className="navBarButtonsContainer">
        <FlatButton
          labelStyle={{'color': 'white'}}
          backgroundColor="#1a75ff"
          hoverColor="#005ce6"
          style={rightButtonsStyle}
          onTouchTap={this.handleLogin}
          label="Login"
        />
        <FlatButton
          labelStyle={{'color': 'white'}}
          backgroundColor="#1a75ff"
          hoverColor="#005ce6"
          style={rightButtonsStyle}
          onTouchTap={this.handleSignup}
          label="Sign up"
        />
      </div>
    );
  }

  menuClickHandler() {
    if(this.state.leftMenuOpen) {
      this.setState({leftMenuOpen: false});
    } else {
      this.setState({leftMenuOpen: true});
    }
  }

  render() {
    var leftMenuStyles = this.state.leftMenuOpen ? {'' : ''} : { 'display': 'none' };

    return (
      <div style={{width: '100%', height: '100%'}}>
        <AppBar
          title='Best Neighbourhood'
          iconElementRight={this.getRightButtons()}
          onLeftIconButtonTouchTap={this.menuClickHandler}
        />
        <div className="contentContainer">
          <div className="leftPanel" style={leftMenuStyles}>
            <LeftMenu
              neighbourhoods_names_centres={this.props.neighbourhoods_names_centres}
              setMaps={this.setMaps}
              getMaps={this.getMaps}
              getMap={this.getMap}
            />
          </div>
          <div className="mainContent">
            <div className="map">
              <MapContent
                setMaps={this.setMaps}
                getMaps={this.state.updateMaps ? this.getMaps : null}
                getMap={this.state.updateMaps ? this.getMap : null}
                neighborhoods_borders={neighborhoods_borders}
              />
            </div>
            <div className="categories">
              <PreferencesList />
            </div>
          </div>
        </div>
        { this.state.loginDialog ?
          <LoginDialog
            registerClickHandler={this.handleSignup}
            closeHandler={this.closeHandler}
            open={this.state.loginDialog}
          />
        : null }
        { this.state.signupDialog ?
          <SignupDialog
            loginClickHandler={this.handleLogin}
            closeHandler={this.closeHandler}
            open={this.state.signupDialog}
          />
        : null }
      </div>
    );
  }
}

App.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
