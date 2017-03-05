import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

import { NavMenu } from './navmenu';
import { HeaderLogo } from './headerlogo';
import { HeaderBarContainer } from './headerbar';
import { UserMenu } from './usermenu';
import { Loading } from '../loading';

import * as projectActions from '../../actions/projects';
import * as userActions from '../../actions/user';
import * as navActions from '../../actions/nav';

const PATH_TITLES = {
  '': 'InvoiceTime',
  'projects': 'Projects',
  'invoices': 'Invoices',
  'timeslips': 'Time',
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

  handleButton(isDeep) {
    if (isDeep) {
      browserHistory.goBack();
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
          onSetOpen={(navOpen) => this.setState({navOpen})}
        />

        <AppBar
          title={title}
          className='main-app-bar'
          iconElementLeft={icon}
          onLeftIconButtonTouchTap={() => this.handleButton(isDeep)}
        />

        <div className='container'>
          {this.props.children}
        </div>

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
    path: state.nav.headerBar.get('path'),
    isLoaded: state.nav.view.get('isLoaded')
  };
};

const actions = {
  ...projectActions,
  ...userActions,
  ...navActions
};

const NavContainer = connect(mapStateToProps, actions)(Nav);
export { NavContainer };
