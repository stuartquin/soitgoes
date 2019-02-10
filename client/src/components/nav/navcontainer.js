import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import NavMenu from './navmenu';
import { Loading } from 'components/loading';

import { TimeslipsContainer} from 'components/timeslips/timeslipcontainer';
import { InvoicesContainer } from 'components/invoices/invoicescontainer';
import { InvoiceContainer } from 'components/invoices/invoicecontainer';
// import { ProjectsContainer } from 'components/projects/projectscontainer';
// import { ProjectContainer } from 'components/projects/projectcontainer';
// import { DashContainer } from 'components/dash/dash';
// import { TasksContainer } from 'components/tasks/taskscontainer';
// import { TaskContainer } from 'components/tasks/taskcontainer';
// import { ContactsContainer } from 'components/contact/contactscontainer';
// import { ContactContainer } from 'components/contact/contactcontainer';

import {fetchProjects} from 'modules/project';
import {setIsLoaded, navigate} from 'modules/nav';
import * as userActions from '../../actions/user';

const PATH_TITLES = {
  '': 'InvoiceTime',
  'projects': 'Projects',
  'invoices': 'Invoices',
  'timeslips': 'Time',
  'contacts': 'Contacts',
  'tasks': 'Tasks',
  'dash': 'Dash'
}

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
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
      this.props.fetchProjects()
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
      <div className='wrapper'>
        <NavMenu />
        <div className='container'>
          <Route path='/timeslips' component={TimeslipsContainer} />
          <Route exact path='/invoices' component={InvoicesContainer} />
          <Route path='/invoices/:id' component={InvoiceContainer} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const actions = {
  ...userActions,
  fetchProjects,
  setIsLoaded,
  navigate
};

const NavContainer = connect(mapStateToProps, actions)(Nav);
export { NavContainer };



        // <div className='container'>
        //   <Route path='/timeslips' component={TimeslipsContainer} />
        //   <Route exact path='/invoices' component={InvoicesContainer} />
        //   <Route path='/invoices/:id' component={InvoiceContainer} />
        //   <Route exact path='/projects' component={ProjectsContainer} />
        //   <Route path='/projects/:id' component={ProjectContainer} />
        //   <Route exact path='/tasks' component={TasksContainer} />
        //   <Route path='/tasks/:id' component={TaskContainer} />
        //   <Route exact path='/contacts' component={ContactsContainer} />
        //   <Route path='/contacts/:id' component={ContactContainer} />
        //   <Route exact path='/' component={DashContainer} />
        // </div>

