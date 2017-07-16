import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

import NavMenu from './navmenu';
import { Loading } from '../loading';
import FlashMesasge from 'components/flashmessage';

import { TimeslipsContainer} from 'components/timeslips/timeslipcontainer';
import { InvoicesContainer } from 'components/invoices/invoicescontainer';
import { InvoiceContainer } from 'components/invoices/invoicecontainer';
import { ProjectsContainer } from 'components/projects/projectscontainer';
import { ProjectContainer } from 'components/projects/projectcontainer';
import { DashContainer } from 'components/dash/dash';
import { TasksContainer } from 'components/tasks/taskscontainer';
import { TaskContainer } from 'components/tasks/taskcontainer';
import { ContactsContainer } from 'components/contact/contactscontainer';
import { ContactContainer } from 'components/contact/contactcontainer';

import {fetchProjects} from 'modules/project';
import {clearFlashMessage} from 'modules/flashmessage';
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
      navOpen: false
    };
  }

  componentDidMount() {
    this.fetchBase().then(() => {
      this.props.setIsLoaded(true);
    });
  }

  fetchBase() {
    return Promise.all([
      this.props.fetchVersion(),
      this.props.fetchAccounts(),
      this.props.fetchProjects()
    ]);
  }

  onLogout() {
    location.href = '/logout/';
  }

  onReload() {
    location.reload();
  }

  handleNavigate(path) {
    this.props.navigate(path);
  }

  handleButton(isDeep) {
    if (isDeep) {
      window.history.back();
    } else {
      this.setState({navOpen: true});
    }
  }

  closeMenu() {
    this.setState({navOpen: false})
  }

  render() {
    if (!this.props.isLoaded) {
      return (
        <div className='wrapper'>
          <Loading />
        </div>
      );
    }
    const basePath = this.props.path.get(0);
    const title = PATH_TITLES[basePath];
    const isDeep = this.props.path.count() > 1;

    let icon = null;
    if (isDeep) {
      icon = (<IconButton><NavigationArrowBack /></IconButton>);
    }

    return (
      <div className='wrapper'>
        <NavMenu
          open={this.state.navOpen}
          onNavigate={(path) => this.handleNavigate(path)}
          onSetOpen={(navOpen) => this.setState({navOpen})}
          onLogout={() => this.props.logout()}
        />

        <AppBar
          title={title}
          className='main-app-bar'
          iconElementLeft={icon}
          onLeftIconButtonTouchTap={() => this.handleButton(isDeep)}
        />

        <div className='container'>
          <Route path='/timeslips' component={TimeslipsContainer} />
          <Route exact path='/invoices' component={InvoicesContainer} />
          <Route path='/invoices/:id' component={InvoiceContainer} />
          <Route exact path='/projects' component={ProjectsContainer} />
          <Route path='/projects/:id' component={ProjectContainer} />
          <Route exact path='/tasks' component={TasksContainer} />
          <Route path='/tasks/:id' component={TaskContainer} />
          <Route exact path='/contacts' component={ContactsContainer} />
          <Route path='/contacts/:id' component={ContactContainer} />
          <Route exact path='/' component={DashContainer} />
        </div>

        <FlashMesasge
          message={this.props.flashMessage}
          onCloseMessage={this.props.clearFlashMessage}
          onNavigate={(path) => this.handleNavigate(path)}
        />

        <Snackbar
          open={this.props.version.get('isNew')}
          message='A new version is available'
          action='Update'
          autoHideDuration={20000}
          onActionTouchTap={() => this.onReload()}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.user.user,
    version: state.user.version,
    flashMessage: state.flashMessage,
    path: state.nav.headerBar.get('path'),
    isLoaded: state.nav.view.get('isLoaded')
  };
};

const actions = {
  ...userActions,
  fetchProjects,
  clearFlashMessage,
  setIsLoaded,
  navigate
};

const NavContainer = connect(mapStateToProps, actions)(Nav);
export { NavContainer };
