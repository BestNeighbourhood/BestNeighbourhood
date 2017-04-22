import React from 'react';
import { Checkbox, List, ListItem, Subheader } from 'material-ui';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import CategorySlider from './CategorySlider.jsx';
import IP from '../../../../config/config.js';
import ReactTooltip from 'react-tooltip';

export default class PreferencesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentOpen: "",
      categories: undefined,
      sliderValues: undefined,
    }
  }

  componentWillMount() {
    //fetching the list of categories and subcategories (datasets)
    var _this = this;
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var categories =  JSON.parse(httpRequest.responseText);

        let sliderValues = [];
        var formattedCategories = {};
        for(let i =0; i< categories.length; i++) {

          var subcategories = {};
          for(let j = 0; j < categories[i].datasets.length; j++) {

            subcategories[categories[i].datasets[j]] = {
              disabled: false,
            };
            sliderValues[categories[i].datasets[j]] = 50;
          }
          formattedCategories[categories[i]._id] = {
            subcategories: subcategories
          };
        }

        _this.setState({
          categories: formattedCategories,
          sliderValues: sliderValues,
        });
      }
    };
    httpRequest.open('GET', "http://" + IP + "/data/categories");
    httpRequest.send(null);

  }

  // for the initial sorting
  // once the markers are rendered - the initiallySorted prop becomes 'true'
  // letting us know that we need to send the proferences for the initial sorting
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.initiallySorted == false) {
      if(this.props.initiallySorted == true) {
        let _this = this;
        setTimeout(this.updateNeighbourhoodsData.bind(_this), 1000);
      }
    }
  }

  //close/open submenus
  toggleCategory(category) {
    if(this.state.currentOpen == category) {
      this.setState({
        currentOpen: undefined,
      });
    } else {
      this.setState({
        currentOpen: category,
      });
    }
  }

  updateSliderValue = (value, subcategoryName) => {
    let sliderValues = this.state.sliderValues;
    sliderValues[subcategoryName] = value;
    this.setState(sliderValues);
  }

  //this function generates the list of active preferences and passes it up
  //to the component which updates the neighbourhood data base on the preferences 
  updateNeighbourhoodsData() {

    //if everything happened too quickly and there is no categories or sliderValues yet
    //then try again in a second
    if(this.state.categories == undefined || this.state.sliderValues == undefined) {
      let _this = this;
      setTimeout(this.updateNeighbourhoodsData.bind(_this), 1000);
    }

    //creating an object with the list of active preferences and sending it up
    //in order to update the markers and the list
    let activePreferences = [];

    let categories = this.state.categories;
    for(var category in this.state.categories) {

      let subcategories = categories[category].subcategories;
      for(var subcategory in subcategories) {
        if(!subcategories[subcategory].disabled) {
          activePreferences[subcategory] = {
            value: this.state.sliderValues[subcategory],
            category: category,
          };
        }
      }
    }

    this.props.updateNeighbourhoodsData(activePreferences);

  }

  handleTouchTap = (event) => {
    //to prevent the menu from opening/closing when the checkbox is clicked
    event.stopPropagation();
  }

  handleCheckbox(category, event, isInputChecked) {
    let categories = this.state.categories;
    for (var key in categories[category].subcategories) {
      categories[category].subcategories[key].disabled = !isInputChecked;
    }
    this.setState({
      categories: categories,
    });
    this.updateNeighbourhoodsData();
  }

  render() {
    let categories = this.state.categories;
    let sliderValues = this.state.sliderValues;
    return (
      <List>
        <Subheader className="preferences-header">Preferences</Subheader>
        {categories && sliderValues ?
          Object.keys(categories).map((category, index) =>
            <ListItem
              disableTouchRipple={true}
              key={index}
              primaryText={<div className="truncatedText preferencesCategoryText">{category}</div>}
              primaryTogglesNestedList={true}
              leftCheckbox={
                <div>
                  <Checkbox data-tip data-for='category-checkbox' onTouchTap={this.handleTouchTap} onCheck={this.handleCheckbox.bind(this, category)} defaultChecked={true}/>
                  <ReactTooltip delayShow={500} place="right" id='category-checkbox' type='info' effect='solid'>
                    <span>Turn On/Off the category</span>
                  </ReactTooltip>
                </div>
              }
              open={this.state.currentOpen == category ? true : false }
              onNestedListToggle={this.toggleCategory.bind(this, category)}
              nestedItems={
                Object.keys(categories[category].subcategories).map((subcategory, index) =>
                  <ListItem
                    key={index}
                    disableTouchRipple={true}
                    children={
                      <CategorySlider
                        key={subcategory + index}
                        onDragStop={this.updateNeighbourhoodsData.bind(this)}
                        sliderHandler={this.updateSliderValue}
                        subcategoryName={subcategory}
                        categoryName={category}
                        sliderValue={sliderValues[subcategory]}
                        disabled={categories[category].subcategories[subcategory].disabled}
                      />
                    }
                  />
                )
              }
            />
          )
        : null}
      </List>
    );
  }
}
