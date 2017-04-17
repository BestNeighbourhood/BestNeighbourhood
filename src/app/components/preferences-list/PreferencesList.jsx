import React from 'react';
import { Checkbox, List, ListItem, Subheader } from 'material-ui';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import CategorySlider from './CategorySlider.jsx';
import IP from '../../../../config/config.js';

export default class PreferencesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentOpen: "",
      preferences: [],
      showList: false,
      sliders: {},
    }
  }

  toggleCategory(category) {
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
    var httpRequest = new XMLHttpRequest();
    var _this = this;
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var preferences =  JSON.parse(httpRequest.responseText);
        var sliders = {};
        for(let i =0; i< preferences.length; i++) {
          for(let j = 0; j < preferences[i].datasets.length; j++) {
            sliders[preferences[i].datasets[j]] = 50;
          }
        }
        _this.setState({
          preferences: preferences,
          showList: true,
          sliders:sliders
        });
      }
    };
    httpRequest.open('GET', "http://" + IP + "/data/categories");
    httpRequest.send(null);
  }

  sliderOnDragStop(value, tableName) {
    var obj = this.state.sliders;
    obj[tableName] = value;
    this.setState(obj);
  }

  render() {
    return (
      <List>
        <Subheader>Preferences</Subheader>
        {this.state.showList ?
          this.state.preferences.map((category, index) =>
            <ListItem
              key={index}
              primaryText={category._id}
              primaryTogglesNestedList={true}
              leftCheckbox={
                <Checkbox defaultChecked={true}/>
              }
              open={this.state.currentOpen == category._id ? true : false }
              onNestedListToggle={this.toggleCategory.bind(this, category._id)}
              nestedItems={
                category.datasets.map((dataset, index) =>
                  <ListItem
                    key={index}
                    leftIcon={<ActionGrade />}
                    children={
                      <CategorySlider
                        datasetName={dataset}
                        key={dataset + index}
                        onDragStop={this.sliderOnDragStop.bind(this)}
                        tableName={dataset}
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
