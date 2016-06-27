import React from 'react';
import {Link} from 'react-router';

import styles from './styles.css';

const NavMenu = (props) => {
  'use strict';
  const navClasses = `nav navbar-nav ${styles.navbarNav}`;

  return (
    <ul className={ navClasses }>
      <li>
        <Link to={'/timeslips'}
            className={styles.navItem}
            activeClassName={styles.navActive}>
          Tracking
        </Link>
      </li>
      <li>
        <Link to={'/invoices'}
            className={styles.navItem}
            activeClassName={styles.navActive}>
          Invoices
        </Link>
      </li>
    </ul>
  );
};

export {NavMenu};
