const K_CIRCLE_SIZE = 25;
const K_STICK_SIZE = 10;
const K_STICK_WIDTH = 3;

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE + K_STICK_SIZE,
  left: -K_CIRCLE_SIZE / 2,
  top: -(K_CIRCLE_SIZE + K_STICK_SIZE)
};

const greatPlaceCircleStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE,
  border: '3px solid #f44336',
  borderRadius: K_CIRCLE_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',

  verticalAlign: 'middle',
  lineHeight: 'normal',
  fontSize: 14,

  color: '#3f51b5',
  fontWeight: 'bold',
  padding: 0,
  cursor: 'pointer',
  boxShadow: '0 0 0 1px white'
};


const greatPlaceCircleStyleHover = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE,
  borderRadius: K_CIRCLE_SIZE,
  backgroundColor: 'white',
  textAlign: 'center',
  fontSize: 15,
  fontWeight: 'bold',
  padding: 0,
  cursor: 'pointer',
  boxShadow: '0 0 0 1px white',
  border: '3px solid #3f51b5',
  color: '#f44336'
};

const greatPlaceStickStyleShadow = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2 + 3.5,
  top: K_CIRCLE_SIZE + 3,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#f44336',
  boxShadow: '0 0 0 1px white'
};


const greatPlaceStickStyle = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2 + 3.5,
  top: K_CIRCLE_SIZE + 3,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#f44336'
};

const greatPlaceStickStyleHover = {
  position: 'absolute',
  left: K_CIRCLE_SIZE / 2 - K_STICK_WIDTH / 2 + 3.5,
  top: K_CIRCLE_SIZE + 3,
  width: K_STICK_WIDTH,
  height: K_STICK_SIZE,
  backgroundColor: '#f44336',
  backgroundColor: '#3f51b5'
};


export {
  greatPlaceStyle,
  greatPlaceCircleStyle, greatPlaceCircleStyleHover,
  greatPlaceStickStyle, greatPlaceStickStyleHover, greatPlaceStickStyleShadow,
K_CIRCLE_SIZE, K_STICK_SIZE};
