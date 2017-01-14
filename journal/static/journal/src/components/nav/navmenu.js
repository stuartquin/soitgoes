'use strict';
import React from 'react';
import {Link} from 'react-router';

import styles from './styles.css';

const NavMenu = (props) => {
  const navClasses = `${styles.navbarNav}`;

  return (
    <ul className={ navClasses }>
      <li className={styles.navItem}>
        <Link to={'/dash'}
          activeClassName={styles.navActive}
          className={styles.navLink}>
          Dashboard
        </Link>
      </li>
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
      <li className={styles.navItem}>
        <Link to={'/tasks'}
          activeClassName={styles.navActive}
          className={styles.navLink}>
          Tasks
        </Link>
      </li>
    </ul>
  );
};

export {NavMenu};
