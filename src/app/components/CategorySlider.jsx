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
    firstSlider: 0.5,
    secondSlider: 50,
  };
}
  handleFirstSlider(event, value) {
    this.setState({firstSlider: value});
  }

  handleSecondSlider(event, value) {
    this.setState({secondSlider: value});
  }

  render() {
    return (
      <Slider
        sliderStyle={{'marginTop': '5px', 'marginBottom': '5px'}}
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        value={this.state.secondSlider}
        onChange={this.handleSecondSlider.bind(this)}
      />
    );
  }
}