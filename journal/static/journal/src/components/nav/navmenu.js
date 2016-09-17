import React from 'react';
import {Link} from 'react-router';

import styles from './styles.css';

const NavMenu = (props) => {
  'use strict';
  const navClasses = `nav navbar-nav ${styles.navbarNav}`;

  return (
    <ul className={ navClasses }>
      <li className={styles.navItem}>
        <Link to={'/invoices'}
          activeClassName={styles.navActive}
          className={styles.navLink}>
          Invoice
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to={'/timeslips'}
          activeClassName={styles.navActive}
          className={styles.navLink}>
          Time
        </Link>
      </li>
    </ul>
  );
};

export {NavMenu};
