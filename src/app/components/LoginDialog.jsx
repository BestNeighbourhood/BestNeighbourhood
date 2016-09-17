import React from 'react';
import IP from '../../../config/config.js';
import { Dialog, FlatButton, RaisedButton, TextField, IconButton } from 'material-ui';
import '../../client/styles/style.scss';
import { validateLogin, validatePassword } from './common.js';

const customContentStyle = {
  width: '20%',
  maxWidth: '400px',
  minWidth: '300px',
};

export default class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: '',
      loginTxtField: '',
      passwordTxtField: '',
      loginErrorText: '',
      passwordErrorText: ''
    };
    this.login = this.login.bind(this);
    this.handleLoginTextFieldChange = this.handleLoginTextFieldChange.bind(this);
    this.handlePasswordTextFieldChange = this.handlePasswordTextFieldChange.bind(this);
  }

  handleClose() {
    this.setState({open: false});
  };

  login() {
    if(!validateLogin(this.state.loginTxtField)) {
      console.log('login validated, its incorrect');
      if(!validatePassword(this.state.passwordTxtField)) {
        this.setState({
          loginErrorText: 'Only haracters and numbers are allowed. Must be > 6 characters long',
          passwordErrorText: 'Must include at least 1 character, 1 number, one of the special characters !@#$%^&* and have at least 8 characters',
        });
      } else {
        this.setState({
          loginErrorText: 'Only haracters and numbers are allowed. Must be > 6 characters long',
          passwordErrorText: '',
        });
      }
    } else if(!validatePassword(this.state.passwordTxtField)) {
      console.log('password validated, its incorrect');
      this.setState({
        loginErrorText: '',
        passwordErrorText: 'Must include at least 1 character, 1 number, one of the special characters !@#$%^&* and have at least 8 characters',
      });
    } else if (this.state.loginErrorText.length > 0 && this.state.passwordErrorText.length > 0) {
      this.setState({
        loginErrorText: '',
        passwordErrorText: '',
      });
    } else {
      var httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', "http://" + IP + "/Auth/signIn/");
      httpRequest.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
      var obj = {
        userName: this.state.loginTxtField,
        password: this.state.passwordTxtField
      }
      httpRequest.send(JSON.stringify(obj));
    }
  }

  handleLoginTextFieldChange(e) {
    this.setState({
      loginTxtField: e.target.value
    });
  }

  handlePasswordTextFieldChange(e) {
    this.setState({
      passwordTxtField: e.target.value
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="REGISTER"
        primary={true}
        onTouchTap={this.props.registerClickHandler}
      />,
      <FlatButton
        label="LOG IN"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.login}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Log In"
          titleClassName="dialogTitle"
          titleStyle={{'fontSize': '28px'}}
          actions={actions}
          modal={false}
          open={this.props.open}
          contentStyle={customContentStyle}
          onRequestClose={this.props.closeHandler}
        >
          <IconButton className="closeXButton" onTouchTap={this.props.closeHandler}>
            X
          </IconButton>
          <TextField
            ref="lg_login"
            className="loginSignupTextFields"
            hintText="John_Doe"
            floatingLabelText="Username"
            value={this.state.loginTxtField}
            onChange={this.handleLoginTextFieldChange}
            errorText={this.state.loginErrorText}
          /><br />
          <TextField
            ref="lg_password"
            className="loginSignupTextFields"
            hintText="<your_secure_password>"
            floatingLabelText="Password"
            type="password"
            value={this.state.passwordTxtField}
            onChange={this.handlePasswordTextFieldChange}
            errorText={this.state.passwordErrorText}
          /><br />
        </Dialog>
      </div>
    );
  }
}
