import React from 'react';
import { connect } from 'react-redux';

import { NavMenu } from './navmenu';
import { HeaderLogo } from './headerlogo';
import { UserMenu } from './usermenu';
import { Version } from '../version/version';

import styles from './styles.css';
import * as projectActions from '../../actions/projects';
import * as userActions from '../../actions/user';


class Nav extends React.Component {
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

  render() {
    const className = `${styles.navContainer}`;
    const navClasses = `${styles.navInner}`;
    return (
      <div>
        <nav className={navClasses}>
          <div className={`container ${ styles.navContainer }`}>
            <HeaderLogo />
            <NavMenu />
            <UserMenu
              user={this.props.user}
              version={this.props.version}
              isLoading={this.props.isUserLoading}
              onLogout={() => this.onLogout()}
            />
          </div>
        </nav>

        <Version
          isNew={this.props.version.get('isNew')}
          onReload={() => this.onReload()}
        />

        <div className='container'>
          {this.props.children}
        </div>
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
