import React from 'react';
import '../../client/styles/style.scss';
import PropTypes from 'prop-types';

import { AppBar, FlatButton  } from 'material-ui';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LoginDialog from './LoginDialog.jsx';
import SignupDialog from './SignupDialog.jsx';
import LeftMenu from './left-menu/LeftMenu.jsx';
import MapContent from './map-content/MapContent.jsx';
import PreferencesList from './preferences-list/PreferencesList.jsx';

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

      //to keep track on what neighbourhood num is hovered on in the list
      hoveredAreaCode: undefined,

      //the main data array for the neighbourhoods
      //including centres and proper custom zoom levels for the markers, borders for each neighbourhood
      //their names and official ara codes
      neighbourhoodsData: undefined,

      //each marker increases this counter once when rendered
      //once they all have been rendered - we send a handler
      //to the PreferencesList and sort the initial data
      markersCounter: 0,
      initiallySorted: false,
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.menuClickHandler = this.menuClickHandler.bind(this);
    this.setMaps = this.setMaps.bind(this);
    this.getMaps = this.getMaps.bind(this);
    this.getMap = this.getMap.bind(this);
  }

  componentWillMount() {
    this.setState({
      //initial neighbourhood data is passed down from the container
      neighbourhoodsData: this.props.neighbourhoodsData,
    });
  }

  updateNeighbourhoodsData = (preferences) => {
    //if on the initial render this function was called
    //before the statistics was passed here - try again in a second
    if(this.props.statistics == undefined) {
      let _this = this;
      setTimeout(this.updateNeighbourhoodsData.bind(_this, preferences), 1000);
    }

    let neighbourhoodsData = this.state.neighbourhoodsData;
    let statistics = this.props.statistics;

    //iterating through the neighbourhoods
    for(let i = 0; i < neighbourhoodsData.length; i++) {
      neighbourhoodsData[i].calculatedRank = 0;

      //going through the statistics for each neighbourhood
      for(let j = 0; j < statistics.length; j++) {

        //statValue - the value for this particular neighbourhood from the dataset
        //e.g number of crimes
        let statValue = statistics[j].neighbourhoods[neighbourhoodsData[i].area_name];

        //statValue can be undefined if there is nothing for this particular neighbourhood
        //preferences not necessarily have this dataset as well (category can be disabled)
        if(statValue != undefined && preferences[statistics[j].dataset]) {

          //making an exception for "Crimes" category, the more crimes - the smaller the rank
          if(preferences[statistics[j].dataset].category == 'Crimes') {
            neighbourhoodsData[i].calculatedRank -= (preferences[statistics[j].dataset].value * statValue / 100);
          } else {
            neighbourhoodsData[i].calculatedRank += (preferences[statistics[j].dataset].value * statValue / 100);
          }
        }
      }
    }

    this.setState({
      neighbourhoodsData: neighbourhoodsData.sort(function(a, b) {
        //if structure is more readable
        if (a.calculatedRank < b.calculatedRank) {
          return 1;
        } else if (a.calculatedRank > b.calculatedRank) {
          return -1;
        } else if (a.area_name < b.area_name) {
          return -1;
        } else if (a.area_name > b.area_name) {
          return 1;
        } else {
          return 0;
        }
        //return a.calculatedRank < b.calculatedRank ? 1: (a.calculatedRank > b.calculatedRank ? -1 : ((a.area_name < b.area_name) ? -1 : (a.area_name > b.area_name) ? 1 : 0 ))
      })
    });
  }

  //each marker will call this once upon render
  increaseMarkersRenderCounter = () => {
    this.setState({
      markersCounter: ++this.state.markersCounter,
    });
  }

  componentDidUpdate() {
    if(!this.state.initiallySorted) {
      if(this.props.statistics != undefined && this.state.markersCounter == this.state.neighbourhoodsData.length) {
        this.setState({
          initiallySorted: true,
        });
      }
    }
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

  handleHovered = (num) => {
    this.setState({
      hoveredAreaCode: num,
    });
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
              handleHovered={this.handleHovered}
              neighbourhoodsData={this.state.neighbourhoodsData}
              getMaps={this.getMaps}
              getMap={this.getMap}
            />
          </div>
          <div className="mainContent">
            <div className="map">
              <MapContent
                hoveredAreaCode={this.state.hoveredAreaCode}
                setMaps={this.setMaps}
                getMaps={this.state.updateMaps ? this.getMaps : null}
                getMap={this.state.updateMaps ? this.getMap : null}
                neighbourhoodsData={this.state.neighbourhoodsData}
                increaseMarkersRenderCounter={this.increaseMarkersRenderCounter}
              />
            </div>
            <div className="categories">
              {this.props.statistics ?
                <PreferencesList updateNeighbourhoodsData={this.updateNeighbourhoodsData} initiallySorted={this.state.initiallySorted}/>
              : null }
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
  muiTheme: PropTypes.object.isRequired,
};
