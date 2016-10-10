import React from 'react';
import { Checkbox, List, ListItem, Subheader } from 'material-ui';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import CategorySlider from './CategorySlider.jsx';
import IP from '../../../config/config.js';

export default class PreferencesList extends React.Component {
  constructor(props) {
    super(props);
/* not used anymore
  keep it just for future reference

    let ed_categories = [
      "Private school contact information",
      "School Locations All Types",
      "Toronto Public Library Branch Locations",
      "Wellbeing Toronto Youth Services"
    ];
    let health_categories = [
      "Sexual Health Clinics Locations, Hours and Services",
      "Ontario Early Years Centres",
      "Licensed Child Care Centres",
      "Ambulance Station Locations",
      "Retirement Homes",
      "Air Conditioned Public Places & Cooling Centres"
    ];
    let cosiness_categories = [ "Street Tree Data"];
    let culture_categories = [
      "Places of Interest and Toronto Attractions",
      "Parks and Recreation Facilities",
      "Cultural Spaces",
      "Parks Drinking Fountains",
      "Places of Worship",
      "Festivals & Events",
      "Heritage Districts",
      "Parks",
      "Multi-Use Trail Entrances",
      "Wellbeing Toronto - Culture(Linguistic)",
      "Wellbeing Toronto - Culture(Cultural )",
      "Recreational Drop in Programs",
      "Cultural Hotspot Points of Interest"
    ];

    let safety_categories = [
      "Police Facility Locations",
      "Fire Station Locations",
      "Automatic External Defibrillators (AED) Locations",
      "Toronto Beaches Water Quality",
      "Safety Indicators (2014)",
      "Break and Enter - Residential",
      "Assault",
      "Robbery",
      "Auto theft",
      "Sexual Assault",
      "Theft Over",
      "Break and Enter - Other",
      "Homicide Snapped Layer",
      "Homicide",
      "Shooting",
      "Theftover Snapped Layer",
      "Patrol Zones Prod",
      "MCI Snapped Layer",
      "ShootingsSnapped Layer",
      "Break and Enter- Commercial",
      "Dinesafe",
      "BodySafe"
    ];

    let transportation_categories = [
      "Bikeways",
      "Bicycle Shops",
      "Bicycle Parking - High Capacity (Outdoor)",
      "Bicycle Parking Bike Stations (Indoor)",
      "On-Street Permit Parking Area Maps",
      "Sidewalk Inventory",
      "Green P Parking",
      "TTC Subway Shapefiles",
      "Bicycle Count and Locations",
      "Bicycle Stations (Bike Share Toronto)"
    ];

    let other_categories = [
      "Regional Municipal Boundary",
      "Wellbeing Toronto - Demographics",
      "Wellbeing Toronto - Civics & Equity Indicators",
      "Population by Age (2014)",
      "Economic Profile (2011)",
      "Ethnicity by Neighbourhood (2011)",
      "Aboriginal Service Organizations"
    ];
*/
    this.state = {
      currentOpen: "Education",
      preferences: [],
      showList: false,
    }
  }

  toggleCategory(category) {
    console.log(category);
    if(this.state.currentOpen == category) {
      this.setState({
        currentOpen: undefined,
      });
    } else {
      this.setState({
        currentOpen: category,
      })
    }
  }
  componentDidMount() {
    console.log('ComponentDidMount');
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      var preferences =  JSON.parse(httpRequest.responseText);
      var i, j;
      var sliders = [];
      for(i =0; i< preferences.length; i++) {
        for(j = 0; j < preferences[i].tables.length; j++) {
          sliders.push({tableName: preferences[i].tables[j].tableName, priority: 50});
        }
      }
      this.setState({
        preferences: preferences,
        showList: true,
        sliders:sliders
      });
    }.bind(this);
    httpRequest.open('GET', "http://" + IP + "/options");
    httpRequest.send(null);
  }

  sliderOnDragStop(value, tableName) {
    var i = 0;
    console.log(this.state.sliders.length);
    for (; i < this.state.sliders.length; i++) {
      if(this.state.sliders[i].tableName == tableName) {
        console.log("HAHAHAHAHAHA");
      }
    }
    console.log(value);
    console.log(tableName);
  }

  render() {
    return (
      <div>
        <List>
          <Subheader>Preferences</Subheader>
          {this.state.showList ?
            this.state.preferences.map((obj, index) =>
              <ListItem
              key={index}
              primaryText={obj.category}
              primaryTogglesNestedList={true}
              leftCheckbox={
                <Checkbox defaultChecked={true}/>
              }
              open={this.state.currentOpen == obj.category ? true : false }
              onNestedListToggle={this.toggleCategory.bind(this, obj.category)}
              nestedItems={
                obj.tables.map((_obj, index) =>
                  <ListItem
                    key={index}
                    primaryText={_obj.title}
                    leftIcon={<ActionGrade />}
                    children={
                      <CategorySlider
                        key={_obj.title + index}
                        onDragStop={this.sliderOnDragStop.bind(this)}
                        tableName={_obj.tableName}
                      />
                    }
                  />
                )
              }
            />
            )
          : null}
        </List>
      </div>
    );
  }
}
