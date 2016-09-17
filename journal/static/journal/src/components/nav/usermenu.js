import React from 'react';

class UserMenu extends React.Component {
  render() {
    return (
      <ul className='nav navbar-nav navbar-right'>
        <li>{this.props.user.get('username')}</li>
      </ul>
    );
  }
}

export {UserMenu};
