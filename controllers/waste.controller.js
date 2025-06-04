const userModel = require("../models/user.model");
const wasteModel = require("../models/waste.model");

exports.createPendingWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId; // del token JWT
    const record = await wasteModel.createPendingWasteRecord({
      ...req.body,
      user_id
    });

    res.status(201).json({
      message: "Waste record submitted successfully.",
      record
    });
  } catch (error) {
    console.error("Error creating waste record:", error);
    res.status(500).json({ message: "Error creating waste record" });
  }
};

exports.getPendingWasteRecords = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const records = await wasteModel.getPendingWasteRecordsByUser(user_id);
    res.json(records);
  } catch (error) {
    console.error("Error fetching pending waste records:", error);
    res.status(500).json({ message: "Error fetching waste records" });
  }
};

exports.getPendingWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const id = req.params.id;
    const record = await wasteModel.getPendingWasteRecordById(id, user_id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    console.error("Error fetching waste record:", error);
    res.status(500).json({ message: "Error fetching waste record" });
  }
};

exports.updatePendingWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const id = req.params.id;
    const updatedRecord = await wasteModel.updatePendingWasteRecord(id, user_id, req.body);
    if (!updatedRecord) return res.status(404).json({ message: "Record not found or not authorized" });
    res.json({
      message: "Record updated successfully",
      updatedRecord
    });
  } catch (error) {
    console.error("Error updating waste record:", error);
    res.status(500).json({ message: "Error updating waste record" });
  }
};

exports.deletePendingWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const id = req.params.id;
    await wasteModel.deletePendingWasteRecord(id, user_id);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting waste record:", error);
    res.status(500).json({ message: "Error deleting waste record" });
  }
};

exports.confirmPendingWasteRecord = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const id = req.params.id;
    const confirmedRecord = await wasteModel.confirmWasteRecord(id, user_id);
    if (!confirmedRecord) return res.status(404).json({ message: "Record not found or not authorized" });
    res.json({
      message: "Record confirmed successfully",
      confirmedRecord
    });
  } catch (error) {
    console.error("Error confirming waste record:", error);
    res.status(500).json({ message: "Error confirming waste record" });
  }
};

exports.getConfirmedWasteRecords = async (req, res) => {
  try {
    const username = req.user.username;

    // Validar que sea admin
    if (username !== "01234644") {
      return res.status(403).json({ message: "Access denied: Admin only." });
    }

    const { month, year } = req.query; // vienen como strings, opcionales

    // Convertir a números si existen
    const monthNum = month ? parseInt(month) : null;
    const yearNum = year ? parseInt(year) : null;

    const records = await wasteModel.getConfirmedWasteRecords({ month: monthNum, year: yearNum });
    res.json(records);
  } catch (error) {
    console.error("Error fetching confirmed waste records:", error);
    res.status(500).json({ message: "Error fetching confirmed waste records" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const username = req.user.username;

    // Validar si es admin para dar acceso o no
    // Si quieres que todos los usuarios puedan ver, elimina esta validación
    if (username !== "01234644") {
      return res.status(403).json({ message: "Access denied: Admin only." });
    }

    // Obtenemos datos de KPIs desde modelo
    const totalConfirmed = await wasteModel.getTotalConfirmedWasteAmount();
    const amountByType = await wasteModel.getConfirmedWasteAmountByType();

    res.json({
      totalConfirmed,
      amountByType,
      message: "Dashboard KPIs fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};