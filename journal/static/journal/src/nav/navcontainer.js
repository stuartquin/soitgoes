import React from 'react';
import {connect} from 'react-redux';

import {NavMenu} from './navmenu';
import {HeaderLogo} from './headerlogo';
import styles from './styles.css';
import * as projectActions from '../actions/projects';
import * as userActions from '../actions/user';


class Nav extends React.Component {
  componentDidMount() {
    this.props.fetchUser().then(() =>
      this.props.fetchProjects()
    );
  }

  render() {
    const className = `navbar ${styles.navOuter}`;
    const navClasses = `navbar-inner ${styles.navInner}`;
    return (
      <div className={className}>
        <nav className={navClasses}>
          <div className='container'>
            <HeaderLogo />
            <NavMenu />
          </div>
        </nav>
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
  };
};

const actions = {
  ...projectActions,
  ...userActions
};


const NavContainer = connect(mapStateToProps, actions)(Nav);
export {NavContainer};
