import React from 'react';
import styled, {ThemeProvider} from 'styled-components';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { Loading } from 'components/loading';
import {theme} from 'components/GUI';
import Invoice from 'components/Invoice';
import Invoices from 'components/Invoices';
import Timeslips from 'components/Timeslips';
import Tasks from 'components/Tasks';

import {fetchContacts} from 'modules/contact';
import {fetchProjects} from 'modules/project';
import {setIsLoaded} from 'modules/nav';
import * as userActions from '../../actions/user';

const Styled = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 100%;
  color: ${props => props.theme.grey.darkest};
  background: ${props => props.theme.grey.light};
`;

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount() {
    this.fetchBase().then(() => this.setState({isLoaded: true}));
  }

  fetchBase() {
    return Promise.all([
      this.props.fetchVersion(),
      this.props.fetchAccounts(),
      this.props.fetchProjects(),
      this.props.fetchContacts()
    ]);
  }

  render() {
    const {isLoaded} = this.state;

    if (!isLoaded) {
      return (
        <div className='wrapper'>
          <Loading />
        </div>
      );
    }

    return (
      <Styled>
        <Route path='/timeslips' component={Timeslips} />
        <Route exact path='/invoices' component={Invoices} />
        <Route exact path='/tasks' component={Tasks} />
        <Route
          path='/project/:projectId/invoice'
          component={Invoice}
          exact
        />
        <Route
          path='/project/:projectId/invoice/:invoiceId'
          component={Invoice}
        />
      </Styled>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const actions = {
  ...userActions,
  fetchProjects,
  fetchContacts,
  setIsLoaded,
};

const NavContainer = connect(mapStateToProps, actions)(Nav);
export { NavContainer };
