import React from 'react';

import styles from './styles.css';

const Version = (props) => {
  const className = `alert alert-success ${ styles.version }`;

  if (props.isNew) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <div className={ className }>
              A new version is available
              <a onClick={props.onReload} className='alert-link pull-right'>
                Update
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div />;
};

export { Version };
