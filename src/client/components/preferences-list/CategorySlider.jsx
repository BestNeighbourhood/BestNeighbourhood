import React from 'react';
import Slider from 'material-ui/Slider';

/**
 * The slider bar can have a set minimum and maximum, and the value can be
 * obtained through the value parameter fired on an onChange event.
 */
export default class CategorySlider extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSliderChange(event, value) {
    this.props.sliderHandler(value, this.props.subcategoryName);
  }

  handleOnDragStop(event) {
    this.props.onDragStop(this.props.subcategoryName);
  }

  render() {
    return (
      <div>
        <div className="truncatedText">
         {this.props.subcategoryName}
        </div>
        <Slider
          sliderStyle={{'marginTop': '0px', 'marginBottom': '0px'}}
          min={0}
          max={100}
          step={1}
          value={this.props.sliderValue}
          onChange={this.handleSliderChange.bind(this)}
          onDragStop={this.handleOnDragStop.bind(this)}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}
