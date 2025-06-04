import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteHistory.css";
import PendingRegistryCard from "../components/PendingRegistryCard"; 


export default function WasteHistory() {
  const videoRef = useRef(null);
  const [records, setRecords] = useState([]);

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

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axiosInstance.get("/api/waste/history");
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchRecords();
  }, []);

  // test
  const registroPendiente = {
    id: 1,
    entry_date: "2025-06-01",
    exit_date: "2025-06-03",
    type: "Trapo .. ",
    amount: 0.05,
    container: "Tambo",
    area: "Welding",
    art71: "123ABC",
    reason_art71: " XYZ",
    aut_semarnat: "ABC123",
    aut_SCT: "SCT999",
    reason_destination: "ABC",
    aut_destination: "DEST001",
    chemicals: ["C", "R"],
    responsible: "Yamileth"
  };

  // funciones temporales
  const handleConfirm = (id) => console.log(`Confirmar: ${id}`);
  const handleEdit = (id) => console.log(`Editar: ${id}`);
  const handleDelete = (id) => console.log(`Eliminar: ${id}`);

  return (
    <div className="history-screen">

      <Navbar />

      <div className="history-container">
        <h1 className="history-title">Historial de Residuos</h1>
          <PendingRegistryCard
            registry={registroPendiente}
            onConfirm={handleConfirm}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
      </div>
    </div>
  );
}
