import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
<div>
  <div className="navbar">
    <div className="logo">DFA Passport Services</div>
    
    {/* Mobile Menu Toggle */}
    <div className="mobile-menu-toggle" onClick={toggleMenu}>
      {isMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
    </div>

    <ul className={`menu ${isMenuOpen ? 'menu-open' : ''}`}>
      <li>Home</li>
      <li className="services-menu">
        Services
        <div className="dropdown">
          <p>Passport</p>
          <p>Book Appointments</p>
          <p>Requirements</p>
        </div>
      </li>
      <li>FAQs</li>
      <li>Contact Us</li>
    </ul>

   

    
  </div>

  
  </div>
  );
};

export default Header;