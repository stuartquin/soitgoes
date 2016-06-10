import React from 'react';
import {Link} from 'react-router';

import styles from './styles.css';

const NavMenu = (props) => {
  'use strict';

  return (
    <ul className={styles.navMenu}>
      <li><Link to={'/timeslips'} activeClassName={styles.navActive}>Tracking</Link></li>
      <li><Link to={'/invoices'} activeClassName={styles.navActive}>Invoices</Link></li>
    </ul>
  );
};

export {NavMenu};
