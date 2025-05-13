import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

function NavbarBtn({ to, children, onClick }) {
  if (to) {
    return (
      <Link to={to} className="navbar-btn">
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="navbar-btn">
      {children}
    </button>
  );
}

export default NavbarBtn;
