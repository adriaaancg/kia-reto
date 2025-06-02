import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import "../styles/PendingRequests.css";

export default function PendingRequests() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        const loggedUser = res.data.user;
        setUser(loggedUser);

        const pending = await axiosInstance.get("/users/admin/pending-users");
        setPendingUsers(pending.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndRequests();
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

  const handleDecision = async (id, action) => {
    try {
      if (action === "accept") {
        const res = await axiosInstance.post(`/users/admin/approve/${id}`);
        setFeedback(res.data.message);
      } else if (action === "reject") {
        const res = await axiosInstance.delete(`/users/admin/reject/${id}`);
        setFeedback(res.data.message);
      }
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setFeedback("Error al procesar la solicitud");
    }
  };

  if (!user) return null;

  return (
    <div className="pending-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="pending-video"
      >
        <source src="/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <Navbar username={user.username} />

      <div className="pending-container">
        <h1 className="pending-title">Solicitudes Pendientes</h1>
        {feedback && <p className="pending-feedback">{feedback}</p>}
        {pendingUsers.length === 0 ? (
          <p>No hay solicitudes pendientes</p>
        ) : (
          pendingUsers.map((u) => (
            <div key={u.id} className="pending-card">
              <p><strong>{u.name} {u.first_surname}</strong></p>
              <p>Username: {u.username}</p>
              <p>Email: {u.email}</p>
              <div className="pending-buttons">
                <button className="pending-button pending-approve" onClick={() => handleDecision(u.id, "accept")}>✅ Aceptar</button>
                <button className="pending-button pending-reject" onClick={() => handleDecision(u.id, "reject")}>❌ Rechazar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}