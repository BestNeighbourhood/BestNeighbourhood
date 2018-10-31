import IP from '../../../config/config.js';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import App from './App.jsx';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import neighborhoods_borders from '../../data/neighborhoods_borders.js';

injectTapEventPlugin();

const defaultProps = {
  neighbourhoods_centres: [
    {area_s_cd:1, zoom: 14},
    {area_s_cd:2, zoom: 15},
    {area_s_cd:3, zoom: 15},
    {area_s_cd:4, zoom: 15},
    {area_s_cd:5, zoom: 15},
    {area_s_cd:6, zoom: 15},
    {area_s_cd:7, zoom: 15},
    {area_s_cd:8, zoom: 15},
    {area_s_cd:9, zoom: 15},
    {area_s_cd:10, zoom: 15},
    {area_s_cd:11, zoom: 15},
    {area_s_cd:12, zoom: 15},
    {area_s_cd:13, zoom: 16},
    {area_s_cd:14, zoom: 14},
    {area_s_cd:15, zoom: 15},
    {area_s_cd:16, zoom: 15},
    {area_s_cd:17, zoom: 14},
    {area_s_cd:18, zoom: 15},
    {area_s_cd:19, zoom: 15},
    {area_s_cd:20, zoom: 15},
    {area_s_cd:21, zoom: 15},
    {area_s_cd:22, zoom: 15},
    {area_s_cd:23, zoom: 15},
    {area_s_cd:24, zoom: 15},
    {area_s_cd:25, zoom: 15},
    {area_s_cd:26, zoom: 14},
    {area_s_cd:27, zoom: 15},
    {area_s_cd:28, zoom: 16},
    {area_s_cd:29, zoom: 16},
    {area_s_cd:30, zoom: 15},
    {area_s_cd:31, zoom: 15},
    {area_s_cd:32, zoom: 15},
    {area_s_cd:33, zoom: 15},
    {area_s_cd:34, zoom: 15},
    {area_s_cd:35, zoom: 15},
    {area_s_cd:36, zoom: 15},
    {area_s_cd:37, zoom: 15},
    {area_s_cd:38, zoom: 15},
    {area_s_cd:39, zoom: 15},
    {area_s_cd:40, zoom: 15},
    {area_s_cd:41, zoom: 15},
    {area_s_cd:42, zoom: 15},
    {area_s_cd:43, zoom: 15},
    {area_s_cd:44, zoom: 16},
    {area_s_cd:45, zoom: 15},
    {area_s_cd:46, zoom: 15},
    {area_s_cd:47, zoom: 15},
    {area_s_cd:48, zoom: 15},
    {area_s_cd:49, zoom: 15},
    {area_s_cd:50, zoom: 15},
    {area_s_cd:51, zoom: 15},
    {area_s_cd:52, zoom: 15},
    {area_s_cd:53, zoom: 15},
    {area_s_cd:54, zoom: 15},
    {area_s_cd:55, zoom: 15},
    {area_s_cd:56, zoom: 15},
    {area_s_cd:57, zoom: 16},
    {area_s_cd:58, zoom: 15},
    {area_s_cd:59, zoom: 15},
    {area_s_cd:60, zoom: 16},
    {area_s_cd:61, zoom: 16},
    {area_s_cd:62, zoom: 15},
    {area_s_cd:63, zoom: 15},
    {area_s_cd:64, zoom: 16},
    {area_s_cd:65, zoom: 16},
    {area_s_cd:66, zoom: 16},
    {area_s_cd:67, zoom: 16},
    {area_s_cd:68, zoom: 16},
    {area_s_cd:69, zoom: 16},
    {area_s_cd:70, zoom: 14},
    {area_s_cd:71, zoom: 16},
    {area_s_cd:72, zoom: 17},
    {area_s_cd:73, zoom: 16},
    {area_s_cd:74, zoom: 17},
    {area_s_cd:75, zoom: 16},
    {area_s_cd:76, zoom: 16},
    {area_s_cd:77, zoom: 14},
    {area_s_cd:78, zoom: 16},
    {area_s_cd:79, zoom: 16},
    {area_s_cd:80, zoom: 16},
    {area_s_cd:81, zoom: 16},
    {area_s_cd:82, zoom: 15},
    {area_s_cd:83, zoom: 16},
    {area_s_cd:84, zoom: 16},
    {area_s_cd:85, zoom: 15},
    {area_s_cd:86, zoom: 16},
    {area_s_cd:87, zoom: 15},
    {area_s_cd:88, zoom: 16},
    {area_s_cd:89, zoom: 16},
    {area_s_cd:90, zoom: 16},
    {area_s_cd:91, zoom: 16},
    {area_s_cd:92, zoom: 16},
    {area_s_cd:93, zoom: 15},
    {area_s_cd:94, zoom: 16},
    {area_s_cd:95, zoom: 15},
    {area_s_cd:96, zoom: 16},
    {area_s_cd:97, zoom: 16},
    {area_s_cd:98, zoom: 15},
    {area_s_cd:99, zoom: 15},
    {area_s_cd:100, zoom: 16},
    {area_s_cd:101, zoom: 16},
    {area_s_cd:102, zoom: 16},
    {area_s_cd:103, zoom: 15},
    {area_s_cd:104, zoom: 16},
    {area_s_cd:105, zoom: 15},
    {area_s_cd:106, zoom: 16},
    {area_s_cd:107, zoom: 16},
    {area_s_cd:108, zoom: 15},
    {area_s_cd:109, zoom: 16},
    {area_s_cd:110, zoom: 16},
    {area_s_cd:111, zoom: 15},
    {area_s_cd:112, zoom: 16},
    {area_s_cd:113, zoom: 15},
    {area_s_cd:114, zoom: 16},
    {area_s_cd:115, zoom: 16},
    {area_s_cd:116, zoom: 15},
    {area_s_cd:117, zoom: 15},
    {area_s_cd:118, zoom: 15},
    {area_s_cd:119, zoom: 14},
    {area_s_cd:120, zoom: 15},
    {area_s_cd:121, zoom: 16},
    {area_s_cd:122, zoom: 15},
    {area_s_cd:123, zoom: 15},
    {area_s_cd:124, zoom: 15},
    {area_s_cd:125, zoom: 16},
    {area_s_cd:126, zoom: 15},
    {area_s_cd:127, zoom: 15},
    {area_s_cd:128, zoom: 15},
    {area_s_cd:129, zoom: 15},
    {area_s_cd:130, zoom: 15},
    {area_s_cd:131, zoom: 14},
    {area_s_cd:132, zoom: 15},
    {area_s_cd:133, zoom: 15},
    {area_s_cd:134, zoom: 15},
    {area_s_cd:135, zoom: 15},
    {area_s_cd:136, zoom: 15},
    {area_s_cd:137, zoom: 15},
    {area_s_cd:138, zoom: 15},
    {area_s_cd:139, zoom: 15},
    {area_s_cd:140, zoom: 15},
  ]
};

export default class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      neighbourhoodsData: undefined,
      statistics: undefined,
    };
  }

  componentWillMount() {
    let neighbourhoodsData = neighborhoods_borders;

    let counter = 0;
    for (var i = 0; i < neighbourhoodsData.length; i++) {
      var center = neighbourhoodsData[i].center.split(",");
      neighbourhoodsData[i].center = [parseFloat(center[0]), parseFloat(center[1])];

      for (var j = 0; j < this.props.neighbourhoods_centres.length; j++ ){

        //looking for a custom zoom property
        if(this.props.neighbourhoods_centres[j].area_s_cd == neighbourhoodsData[i].area_s_cd) {
          neighbourhoodsData[i].zoom = this.props.neighbourhoods_centres[j].zoom;
          break;
        }
      }

      //formatting border coordinates before sending them further
      var borders = new Array();
      var geometry = neighbourhoodsData[i].geometry.coordinates[0];

      for(var j = 0; j < geometry.length; j++){ // 93
        borders.push({
          lat: geometry[j][1],
          lng: geometry[j][0],
        });
      }

      //deleting raw geometry from the memory
      delete neighbourhoodsData[i].geometry;

      //adding a new formatted object
      neighbourhoodsData[i].borders = borders;
    }

    this.setState({
      neighbourhoodsData: neighbourhoodsData,
    });

    this.fetchStatistics()
  }

  fetchStatistics() {
    //fetching the statistics
    var _this = this;
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('fetching statistics');
        var _statistics =  JSON.parse(httpRequest.responseText);
        //to avoid empty datasets
        var statistics = [];
        for(let i = 0; i < _statistics.length; i++) {

          //some datasets come without neighbourhoods objects inside (Recreational Drop in Programs)
          if(_statistics[i].neighbourhoods) {

            //looking for the maxValue for each dataset in the statistics
            //and making the rest relative to the maxValue (0, 1) where maxValue is 1.
            let maxValue = 0;
            for(let j = 0; j < _statistics[i].neighbourhoods[0].length; j++) {
              if(_statistics[i].neighbourhoods[0][j].count > maxValue) {
                maxValue = _statistics[i].neighbourhoods[0][j].count;
              }
            }

            //changing neighbourhoods arrays to objects and add a calculated count
            let neighbourhoods = {};
            for(let j = 0; j < _statistics[i].neighbourhoods[0].length; j++) {
              neighbourhoods[_statistics[i].neighbourhoods[0][j].title] = _statistics[i].neighbourhoods[0][j].count / maxValue;
            }
            _statistics[i].neighbourhoods = neighbourhoods;

            statistics.push(_statistics[i]);
          }
        }

        _this.fetchPopulation(statistics);
      }
    };
    httpRequest.open('GET', "http://" + IP + "/data/stat");
    httpRequest.send(null);
  }

  fetchPopulation(statistics) {
    //fetching the statistics
    var _this = this;
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('fetching population');
        var _population =  JSON.parse(httpRequest.responseText);

        let population = {};
        for(let i = 0; i < _population.length; i++) {
          for(let j = 0; j < neighborhoods_borders.length; j++) {
            if(_population[i].num == neighborhoods_borders[j].area_s_cd) {
              population[neighborhoods_borders[j].area_name] = _population[i].pop_male + _population[i].pop_female;
            }
          }
        }

        _this.setState({
          statistics: statistics,
          population: population,
        });
      }
    };
    httpRequest.open('GET', "http://" + IP + "/data/population");
    httpRequest.send(null);
  }

  render() {
    return (
      <App neighbourhoodsData={this.state.neighbourhoodsData} statistics={this.state.statistics} population={this.state.population}/>
    );
  }
}

AppContainer.propTypes = {
  neighbourhoods_names_centres: PropTypes.array
};

AppContainer.defaultProps = defaultProps;

ReactDOM.render(
  <AppContainer />,
  document.getElementById('app')
);
