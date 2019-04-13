import React from 'react';
import styled from 'styled-components';
import {BREAKPOINTS, Container, Grid, Cell} from 'components/Grid';
import {Button} from 'components/GUI';
import {Input} from 'components/Form';


const InputRow = styled.div`
  margin-bottom: 8px;
`;

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
    const {onSubmit} = this.props;
    const {form} = this.state;

    return (
      <Grid>
        <Cell xs={2} sm={4} />
        <Cell xs={8} sm={4}>
          <InputRow>
            <Input
              placeholder="Username"
              name="username"
              value={this.state.form.username}
              onChange={this.handleChange}
            />
          </InputRow>
          <InputRow>
            <Input
              placeholder="Password"
              name="password"
              type="password"
              value={this.state.form.password}
              onChange={this.handleChange}
            />
          </InputRow>
          <Button type="success" onClick={() => onSubmit(form)}>
            Login
          </Button>
        </Cell>
        <Cell sm={4} />
      </Grid>
    );
  }
}

export {Login};
