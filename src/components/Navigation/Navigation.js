import React from 'react';
import {Link} from 'react-router';

function Navigation() {
  return (
    <div role="navigation">
      <Link data-hook="counter-tab" to="/">{'counter'}</Link> {' '}
      <Link data-hook="site-list-tab" to="/site-list">{'mysites'}</Link>
    </div>
  );
}

export default Navigation;
