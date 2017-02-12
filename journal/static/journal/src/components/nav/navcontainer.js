import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';

import { NavMenu } from './navmenu';
import { HeaderLogo } from './headerlogo';
import { HeaderBarContainer } from './headerbar';
import { UserMenu } from './usermenu';
import { Version } from '../version/version';

import styles from './styles.css';
import * as projectActions from '../../actions/projects';
import * as userActions from '../../actions/user';
import * as navActions from '../../actions/nav';


class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navOpen: true
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

  render() {
    const className = `${styles.navContainer}`;
    const navClasses = `${styles.navInner}`;

    if (!this.props.isLoaded) {
      return (
        <div className='wrapper'>
          <h3>Loading...</h3>
        </div>
      );
    }

    return (
      <div className='wrapper'>
        <NavMenu
          open={this.state.navOpen}
          onToggle={() => this.toggleMenu()}
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

        <Version
          isNew={this.props.version.get('isNew')}
          onReload={() => this.onReload()}
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
