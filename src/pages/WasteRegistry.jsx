import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteRegistry.css";

export default function WasteRegistry() {
  const [records, setRecords] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get("/waste/registry"); // A implementar en backend
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 13.1;
    const loopSegment = () => {
      if (video.currentTime >= 20.5) video.currentTime = 13.1;
    };

    video.addEventListener("timeupdate", loopSegment);
    return () => video.removeEventListener("timeupdate", loopSegment);
  }, []);

  return (
    <div className="waste-registry-screen">
      <video ref={videoRef} autoPlay muted loop playsInline className="waste-registry-video">
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <Navbar />

      <div className="waste-registry-container">
        <h2>Bitácora de Residuos Peligrosos</h2>
        <div className="waste-registry-table-wrapper">
          <table className="waste-registry-table">
            <thead>
              <tr>
                <th>Fecha Entrada</th>
                <th>Tipo</th>
                <th>Cantidad (kg)</th>
                <th>Área</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.entry_date}</td>
                  <td>{r.type}</td>
                  <td>{r.amount}</td>
                  <td>{r.area}</td>
                  <td>{r.responsible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}