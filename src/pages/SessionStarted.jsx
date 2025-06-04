import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../styles/SessionStarted.css";

export default function SessionStarted() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res.data.user);

        setUser(res.data.user);
      } catch (err) {
        console.error("Unauthorized access:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 13.1;
    const onTimeUpdate = () => {
      if (video.currentTime >= 20.5) video.currentTime = 13.1;
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="session-screen">
    

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="waste-dashboard-video"
      >
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="buttons-session">
        <button>Cuenta</button>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>


      <div className="session-main-text">
        <img src="/assets/kia-logo-white.png" alt="KIA" />

        <h1 className="session-title">Bienvenido, {user.name}</h1>
        <p className="session-subtitle">¿Qué deseas hacer hoy?</p>

      </div>

      
      <div className="session-container">

        <div className="session-cards">
          <div className="session-card" onClick={() => navigate("/waste-registry")}>
            <img src="/icons/form.svg" alt="Formulario" />
            <span>Registrar residuos</span>
          </div>
          <div className="session-card" onClick={() => navigate("/waste-history")}>
            <img src="/icons/history.svg" alt="Historial" />
            <span>Ver historial</span>
          </div>
          <div className="session-card" onClick={() => navigate("/waste-dashboard")}>
            <img src="/icons/dashboard.svg" alt="Dashboard" />
            <span>Dashboard de KPIs</span>
          </div>

          {user.username === "01234644" && (
            <div className="session-card" onClick={() => navigate("/pending-requests")}>
              <img src="/icons/admin.svg" alt="Solicitudes" />
              <span>Solicitudes</span>
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
}