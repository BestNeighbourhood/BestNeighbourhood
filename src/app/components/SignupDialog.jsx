import React from 'react';
import { Dialog, FlatButton, RaisedButton, TextField, IconButton } from 'material-ui';
import '../../client/styles/style.scss';
import IP from '../../../config/config.js';
import { validateLogin, validatePassword, validateEmail } from './common.js';

const customContentStyle = {
  width: '20%',
  maxWidth: '400px',
  minWidth: '300px',
};

export default class SignupDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginTxtField: '',
      passwordTxtField: '',
      emailTxtField: '',
      loginErrorText: '',
      passwordErrorText: '',
      emailErrorText: '',
    }
    this.handleLoginTextFieldChange = this.handleLoginTextFieldChange.bind(this);
    this.handlePasswordTextFieldChange = this.handlePasswordTextFieldChange.bind(this);
    this.handleEmailTextFieldChange = this.handleEmailTextFieldChange.bind(this);
    this.signup = this.signup.bind(this);
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

  handleEmailTextFieldChange(e) {
    this.setState({
      emailTxtField: e.target.value
    });
  }

  signup() {
    let emailErr = 'Email entered is not a valid email';
    let pswdErr = 'At least 1 character, 1 number, one of the special characters !@#$%^&* and have at least 8 characters';
    let loginErr = 'Only haracters and numbers are allowed. Must be > 6 characters long';

    if(!validateLogin(this.state.loginTxtField)) {

      if(validateEmail(this.state.emailTxtField)) {
        emailErr = '';
      }

      if(validatePassword(this.state.passwordTxtField)) {
        pswdErr = '';
      }

      this.setState({
        loginErrorText: loginErr,
        passwordErrorText: pswdErr,
        emailErrorText: emailErr,
      });

    } else if(!validatePassword(this.state.passwordTxtField)) {
      loginErr = '';

      if(validateEmail(this.state.emailTxtField)) {
        emailErr = '';
      }

      this.setState({
        loginErrorText: loginErr,
        passwordErrorText: pswdErr,
        emailErrorText: emailErr,
      });

    } else if (!validateEmail(this.state.emailTxtField)) {
      loginErr = '';
      pswdErr = '';

      this.setState({
        loginErrorText: loginErr,
        passwordErrorText: pswdErr,
        emailErrorText: emailErr,
      });

    } else {
      var httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', "http://" + IP + "/Auth/signUp/");
      httpRequest.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
      var obj = {
        userName: this.state.loginTxtField,
        password: this.state.passwordTxtField,
        email: this.state.emailTxtField,
      }
      httpRequest.send(JSON.stringify(obj));
    }
  }

  render() {
    const actions = [
      <FlatButton
        label="LOG IN"
        primary={true}
        onTouchTap={this.props.loginClickHandler}
      />,
      <FlatButton
        label="CREATE"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.signup}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Sign Up"
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
            className="loginSignupTextFields"
            hintText="john.doe@example.com"
            floatingLabelText="Email"
            value={this.state.emailTxtField}
            onChange={this.handleEmailTextFieldChange}
            errorText={this.state.emailErrorText}
          /><br />
          <TextField
            className="loginSignupTextFields"
            hintText="John_Doe"
            floatingLabelText="Username"
            value={this.state.loginTxtField}
            onChange={this.handleLoginTextFieldChange}
            errorText={this.state.loginErrorText}
          /><br />
          <TextField
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
