import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({target}) {
    const {form} = this.state;
    form[target.name] = target.value;
    this.setState({form});
  }

  render() {
    let errorText = null;
    if (this.props.loginState.get('error')) {
      errorText = 'Incorrect username/password';
    }
    return (
      <div className='login'>
        <div>
          <input
            placeholder="Username"
            name="username"
            value={this.state.form.username}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={this.state.form.password}
            onChange={this.handleChange}
          />
        </div>
        <button
          className='btn-success'
          onClick={(evt) => {
            evt.preventDefault();
            this.props.onSubmit(this.state.form);
          }}
        >
          Login
        </button>
      </div>
    );
  }
}

export {Login};
