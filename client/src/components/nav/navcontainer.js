import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { Loading } from 'components/loading';

import { TimeslipsContainer} from 'components/timeslips/timeslipcontainer';
// import { InvoicesContainer } from 'components/invoices/invoicescontainer';
import { InvoiceContainer } from 'components/invoices/invoicecontainer';
import Invoices from 'components/Invoices';
// import { ProjectsContainer } from 'components/projects/projectscontainer';
// import { ProjectContainer } from 'components/projects/projectcontainer';
// import { DashContainer } from 'components/dash/dash';
// import { TasksContainer } from 'components/tasks/taskscontainer';
// import { TaskContainer } from 'components/tasks/taskcontainer';
// import { ContactsContainer } from 'components/contact/contactscontainer';
// import { ContactContainer } from 'components/contact/contactcontainer';

import {fetchContacts} from 'modules/contact';
import {fetchProjects} from 'modules/project';
import {setIsLoaded} from 'modules/nav';
import * as userActions from '../../actions/user';

const Styled = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 100%;
  background: #ebeff7;
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
    // Populate store with some essentials
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
        <Route path='/timeslips' component={TimeslipsContainer} />
        <Route exact path='/invoices' component={Invoices} />
        <Route path='/invoices/:id' component={InvoiceContainer} />
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
