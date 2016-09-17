import React from 'react';
import App from './App.jsx';
import ReactDOM from 'react-dom';

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <App />
    );
  }
}

ReactDOM.render(
  <AppContainer />,
  document.getElementById('app')
);
