import React from 'react';
import logo from '../images/header/header-logo.svg';

function Header() {
  return (
    <header className="header">
      <a href="#top" target="_self">
        <img src={logo} className="header__logo" alt="На главную - Mesto Russia" />
      </a>
    </header>
  );
};

export default Header;