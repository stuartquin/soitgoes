import React from 'react';
import { Link } from 'react-router-dom'

const MenuItem = ({text, linkTo}) => {
  console.log('MenuItem', text, linkTo);

  return (
    <div className="menuItem">
      <Link to={linkTo}>
        {text}
      </Link>
    </div>
  );
};

export default MenuItem;
