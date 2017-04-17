import React from 'react';
import Slider from 'material-ui/Slider';

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
export default class CategorySlider extends React.Component {
constructor(props) {
  super(props);
  this.state = {
    secondSlider: 50,
    tableName: this.props.tableName
  };
}
componentDidUpdate() {
  console.log('updated slider class');
}
  handleSecondSlider(event, value) {
    console.log("changing the value");
    console.log(value);
    this.setState({secondSlider: value});
  }
  handleOnDragStop(event, value) {
    console.log('on drag stop inside the slider');
    console.log('current value is :');
    console.log(this.state.secondSlider);
    this.props.onDragStop(this.state.secondSlider, this.state.tableName);
  }
  render() {
    return (
      <div>
        <div>
         {this.props.datasetName}
        </div>
        <Slider
          sliderStyle={{'marginTop': '0px', 'marginBottom': '0px'}}
          min={0}
          max={100}
          step={1}
          defaultValue={50}
          value={this.state.secondSlider}
          onChange={this.handleSecondSlider.bind(this)}
          onDragStop={this.handleOnDragStop.bind(this)}
        />
      </div>
    );
  }
}
