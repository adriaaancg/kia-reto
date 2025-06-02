import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <img src="/assets/kia-logo-white.png" alt="KIA" className="navbar-logo" />
      <div className="navbar-user">
        <span>Hola, {username}</span>
        <button className="navbar-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}