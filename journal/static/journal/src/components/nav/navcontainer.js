import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';

import { NavMenu } from './navmenu';
import { HeaderLogo } from './headerlogo';
import { UserMenu } from './usermenu';
import { Version } from '../version/version';

import styles from './styles.css';
import * as projectActions from '../../actions/projects';
import * as userActions from '../../actions/user';


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

    this.props.fetchUser().then(() =>
      this.props.fetchProjects()
    );
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
    isUserLoading: state.user.isLoading
  };
};

const actions = {
  ...projectActions,
  ...userActions
};


const NavContainer = connect(mapStateToProps, actions)(Nav);
export {NavContainer};
