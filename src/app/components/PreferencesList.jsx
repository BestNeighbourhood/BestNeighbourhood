import React from 'react';
import { Checkbox, List, ListItem, Subheader, Toggle } from 'material-ui';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import CategorySlider from './CategorySlider.jsx';

export default class PreferencesList extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = {
      educationOpen: true,
      healthOpen: false,
      cosinessOpen: false,
      cultureOpen: false,
      publicSafetyOpen: false,
      transportationOpen: false,
      demographicOpen: false,
      currentOpen: "educationOpen",
      educationCategories: ed_categories,
      healthCategories: health_categories,
      cosinessCategories: cosiness_categories,
      cultureCategories: culture_categories,
      safetyCategories: safety_categories,
      transportationCategories: transportation_categories,
      otherCategories: other_categories
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

  render() {
    return (
      <div>
        <List>
          <Subheader>Nested List Items</Subheader>
          <ListItem
            primaryText="Education"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            open={this.state.currentOpen == "educationOpen" ? true : false }
            onNestedListToggle={this.toggleCategory.bind(this, "educationOpen")}
            nestedItems={
              this.state.educationCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
          <ListItem
            primaryText="Health"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            onNestedListToggle={this.toggleCategory.bind(this, "healthOpen")}
            open={this.state.currentOpen == "healthOpen" ? true : false }
            nestedItems={
              this.state.healthCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
          <ListItem
            primaryText="Cosiness"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            onNestedListToggle={this.toggleCategory.bind(this, "cosinessOpen")}
            open={this.state.currentOpen == "cosinessOpen" ? true : false }
            nestedItems={
              this.state.cosinessCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
          <ListItem
            primaryText="Culture/Recreation"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            onNestedListToggle={this.toggleCategory.bind(this, "cultureOpen")}
            open={this.state.currentOpen == "cultureOpen" ? true : false }
            nestedItems={
              this.state.cultureCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
          <ListItem
            primaryText="Public Safety"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            onNestedListToggle={this.toggleCategory.bind(this, "publicSafetyOpen")}
            open={this.state.currentOpen == "publicSafetyOpen" ? true : false }
            nestedItems={
              this.state.safetyCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
          <ListItem
            primaryText="Transportation"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            onNestedListToggle={this.toggleCategory.bind(this, "transportationOpen")}
            open={this.state.currentOpen == "transportationOpen" ? true : false }
            nestedItems={
              this.state.transportationCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
          <ListItem
            primaryText="Other (Demographic/Neighbourhoods)"
            primaryTogglesNestedList={true}
            leftCheckbox={
              <Checkbox/>
            }
            onNestedListToggle={this.toggleCategory.bind(this, "demographicOpen")}
            open={this.state.currentOpen == "demographicOpen" ? true : false }
            nestedItems={
              this.state.otherCategories.map((category, index) =>
                <ListItem
                  key={index}
                  primaryText={category}
                  leftIcon={<ActionGrade />}
                  children={<CategorySlider key={category + index}/>}
                />
              )
            }
          />
        </List>
      </div>
    );
  }
}
