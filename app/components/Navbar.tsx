import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
        <Link to="/" className="logo">
        <p className="text-2xl font-bold text-gradient">resuaid</p>
          </Link>
          <Link to="/upload" className="primary-button w-fit">upload resume</Link>
    </nav>
  );
}
export default Navbar;