import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';

import { NavMenu } from './navmenu';
import { HeaderLogo } from './headerlogo';
import { HeaderBarContainer } from './headerbar';
import { UserMenu } from './usermenu';
import { Loading } from '../loading';

import * as projectActions from '../../actions/projects';
import * as userActions from '../../actions/user';
import * as navActions from '../../actions/nav';


class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: false
    };
  }

  componentDidMount() {
    // Starts a loop
    this.props.fetchVersion();
    Promise.all([
      this.props.fetchUser(),
      this.props.fetchAccounts(),
      this.props.fetchProjects()
    ]).then(() => {
      this.props.setIsLoaded(true);
    });
  }

  onLogout() {
    location.href = '/logout/';
  }

  onReload() {
    location.reload();
  }

  toggleMenu() {
    this.setState({navOpen: !this.state.navOpen})
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

    return (
      <div className='wrapper'>
        <NavMenu
          open={this.state.navOpen}
          onSetOpen={(navOpen) => this.setState({navOpen})}
        />

        <AppBar
          title='InvoiceTime'
          className='main-app-bar'
          iconElementLeft={null}
          onLeftIconButtonTouchTap={() => this.toggleMenu()}
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
    isLoaded: state.nav.view.get('isLoaded')
  };
};

const actions = {
  ...projectActions,
  ...userActions,
  ...navActions
};


const NavContainer = connect(mapStateToProps, actions)(Nav);
export {NavContainer};
