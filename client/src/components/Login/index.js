import React from 'react';
import styled from 'styled-components';
import { BREAKPOINTS, Container, Grid, Cell } from 'components/Grid';
import { Button, Error } from 'components/GUI';
import { Input } from 'components/Form';
import { login } from 'services/api';

const InputRow = styled.div`
  margin-bottom: 8px;
`;

const Page = styled.div`
  min-height: 100vh;
  background-color: #edf1f5;
`;

const Card = styled(Cell)`
  background: white;
  color: #4e5767;
  border-radius: 6px;
  box-shadow: 0 6px 4px hsla(0, 0%, 40%, 0.2);
  padding: 24px 16px;
  height: 400px;
  margin-top: 32px;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {},
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    const { form } = this.state;
    form[target.name] = target.value;
    this.setState({ form });
  }

  handleLogin = (form) => {
    login(form).then((res) => {
      if (res.status === 200) {
        location.reload();
      } else {
        this.setState({ error: 'Error logging in' });
      }
    });
  };

  render() {
    const { form, error } = this.state;

    return (
      <Page>
        <Container>
          <Grid>
            <Cell xs={1} sm={4} />
            <Card xs={10} sm={4}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  this.handleLogin(form);
                }}
              >
                <InputRow>
                  <Input
                    placeholder="Username"
                    name="username"
                    value={this.state.form.username || ''}
                    onChange={this.handleChange}
                  />
                </InputRow>
                <InputRow>
                  <Input
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.form.password || ''}
                    onChange={this.handleChange}
                  />
                </InputRow>
                <Button type="success" onClick={() => this.handleLogin(form)}>
                  Login
                </Button>
              </form>
              {error && <Error>{error}</Error>}
            </Card>
            <Cell sm={4} />
          </Grid>
        </Container>
      </Page>
    );
  }
}

export default Login;
