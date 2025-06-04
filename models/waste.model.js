const db = require("../database/db");

exports.createPendingWasteRecord = async (data) => {
  const {
    entry_date, exit_date, type, amount, container, area,
    art71, reason_art71, aut_semarnat, aut_SCT,
    reason_destination, aut_destination, chemicals,
    responsible, user_id
  } = data;

  const result = await db.query(
    `INSERT INTO pending_hazardous_waste_records (
      entry_date, exit_date, type, amount, container, area,
      art71, reason_art71, aut_semarnat, aut_SCT,
      reason_destination, aut_destination, chemicals,
      responsible, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      $11, $12, $13,
      $14, $15
    ) RETURNING *`,
    [
      entry_date, exit_date, type, amount, container, area,
      art71, reason_art71, aut_semarnat, aut_SCT,
      reason_destination, aut_destination, chemicals,
      responsible, user_id
    ]
  );

  return result.rows[0];
};

// Obtener todos los registros pendientes de un usuario
exports.getPendingWasteRecordsByUser = async (user_id) => {
  const result = await db.query(
    `SELECT * FROM pending_hazardous_waste_records WHERE user_id = $1 ORDER BY creation DESC`,
    [user_id]
  );
  return result.rows;
};

// Obtener un registro pendiente por id y user_id (para seguridad)
exports.getPendingWasteRecordById = async (id, user_id) => {
  const result = await db.query(
    `SELECT * FROM pending_hazardous_waste_records WHERE id = $1 AND user_id = $2`,
    [id, user_id]
  );
  return result.rows[0];
};

// Actualizar registro pendiente por id y user_id
exports.updatePendingWasteRecord = async (id, user_id, data) => {
  const {
    entry_date, exit_date, type, amount, container, area,
    art71, reason_art71, aut_semarnat, aut_SCT,
    reason_destination, aut_destination, chemicals,
    responsible
  } = data;

  const result = await db.query(
    `UPDATE pending_hazardous_waste_records SET
      entry_date = $1,
      exit_date = $2,
      type = $3,
      amount = $4,
      container = $5,
      area = $6,
      art71 = $7,
      reason_art71 = $8,
      aut_semarnat = $9,
      aut_SCT = $10,
      reason_destination = $11,
      aut_destination = $12,
      chemicals = $13,
      responsible = $14
    WHERE id = $15 AND user_id = $16
    RETURNING *`,
    [
      entry_date, exit_date, type, amount, container, area,
      art71, reason_art71, aut_semarnat, aut_SCT,
      reason_destination, aut_destination, chemicals,
      responsible, id, user_id
    ]
  );
  return result.rows[0];
};

// Eliminar registro pendiente por id y user_id
exports.deletePendingWasteRecord = async (id, user_id) => {
  await db.query(
    `DELETE FROM pending_hazardous_waste_records WHERE id = $1 AND user_id = $2`,
    [id, user_id]
  );
};

// Confirmar registro: copiar de pendiente a confirmado y borrar pendiente
exports.confirmWasteRecord = async (id, user_id) => {
  // Primero obtener el registro pendiente
  const pendingResult = await db.query(
    `SELECT * FROM pending_hazardous_waste_records WHERE id = $1 AND user_id = $2`,
    [id, user_id]
  );
  const record = pendingResult.rows[0];
  if (!record) return null;

  // Insertar en tabla confirmed
  const insertResult = await db.query(
    `INSERT INTO hazardous_waste_records (
      creation,
      entry_date, exit_date, type, amount, container, area,
      art71, reason_art71, aut_semarnat, aut_SCT,
      reason_destination, aut_destination, chemicals,
      responsible, user_id
    ) VALUES (
      CURRENT_TIMESTAMP,
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      $11, $12, $13,
      $14, $15
    ) RETURNING *`,
    [
      record.entry_date, record.exit_date, record.type, record.amount, record.container, record.area,
      record.art71, record.reason_art71, record.aut_semarnat, record.aut_SCT,
      record.reason_destination, record.aut_destination, record.chemicals,
      record.responsible, user_id
    ]
  );

  // Borrar el pendiente
  await db.query(
    `DELETE FROM pending_hazardous_waste_records WHERE id = $1 AND user_id = $2`,
    [id, user_id]
  );

  return insertResult.rows[0];
};

// Obtener registros confirmados con filtro opcional por mes y año
exports.getConfirmedWasteRecords = async ({ month, year }) => {
  let query = `SELECT * FROM hazardous_waste_records`;
  const params = [];
  if (month && year) {
    query += ` WHERE EXTRACT(MONTH FROM entry_date) = $1 AND EXTRACT(YEAR FROM entry_date) = $2`;
    params.push(month, year);
  } else if (month) {
    query += ` WHERE EXTRACT(MONTH FROM entry_date) = $1`;
    params.push(month);
  } else if (year) {
    query += ` WHERE EXTRACT(YEAR FROM entry_date) = $1`;
    params.push(year);
  }
  query += ` ORDER BY creation DESC`;

  const result = await db.query(query, params);
  return result.rows;
};

exports.getTotalConfirmedWasteAmount = async () => {
  const result = await db.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_amount FROM hazardous_waste_records`
  );
  return result.rows[0].total_amount;
};

exports.getConfirmedWasteAmountByType = async () => {
  const result = await db.query(
    `SELECT type, SUM(amount) AS total_amount
     FROM hazardous_waste_records
     GROUP BY type
     ORDER BY total_amount DESC`
  );
  return result.rows;
};