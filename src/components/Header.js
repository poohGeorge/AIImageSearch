// src/components/Header.js
import React from 'react';
import '../styles.css';
import logo from '../assets/LOGO-Image search.svg';

const Header = () => {
  return (
    <header className='header'>
        <img id='logo' src={logo} alt=""/>
    </header>
  );
};

export default Header;
