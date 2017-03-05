import React from 'react';

import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {}
    };
  }

  handleChange(field, val) {
    let form = this.state.form;
    form[field] = val;
    this.setState({form: form});
  }

  render() {
    let errorText = null;
    if (this.props.loginState.get('error')) {
      errorText = 'Incorrect username/password';
    }

    return (
      <div className='content'>
        <Card>
          <CardText>
            <div>
              <TextField
                hintText="Username Field"
                floatingLabelText="Username"
                errorText={errorText}
                value={this.state.form.username}
                onChange={(evt, val) => this.handleChange('username', val)}
              />
            </div>
            <div>
              <TextField
                hintText="Password Field"
                floatingLabelText="Password"
                errorText={errorText}
                type="password"
                value={this.state.form.password}
                onChange={(evt, val) => this.handleChange('password', val)}
              />
            </div>
            <RaisedButton
              className='btn-success'
              label='Login'
              labelPosition='before'
              onTouchTap={(evt) => {
                evt.preventDefault();
                this.props.onSubmit(this.state.form);
              }}
            />
          </CardText>
        </Card>
      </div>
    );
  }
}

export {Login};
