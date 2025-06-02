import express from 'express';
import cors from 'cors';
import { pool } from './bd.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport(
  {
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "265eb84f7bb477",
      pass: "70b4c9d1752ca1"
    }
})

const app = express();
const SECRET =process.env.SECRET//preguntar si esta bien guardar SECRET asi para el token en una variable de ambiente, punto m
app.use(cors());
app.use(express.json());
//falta pasar a base de datos correcta
//falta poner mas cosas a cada rol

// Endpoints
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Username recibido:", username);
    
    
    const result = await pool.query("SELECT * FROM empleados WHERE nombre_empleado = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'cont no existe' });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.contraseña_empleado);
    
    if (passwordMatch) {

    //const useridResult = await pool.query("SELECT user_id FROM users WHERE username=$1", [username]);
  
    
    //const userid = useridResult.rows[0].user_id;
    
    const newUser = await pool.query("SELECT es_admin FROM empleados WHERE nombre_empleado = $1", [username]);
    const login = await pool.query("SELECT id_empleado, es_admin FROM empleados WHERE nombre_empleado = $1", [username]);

    const id = login.rows[0].id_empleado;
    console.log(id)
    const log = await pool.query("INSERT INTO login (id_empleado, log_in) VALUES ($1, NOW())",[id]);
    
    
    const role = newUser.rows[0]?.es_admin;
    console.log(role)
    

    if(role !== 'Usuario'){
      return res.status(403).json({ message: 'Acceso denegado: rol no permitido' });
      
    }
    const payload = {
      id: role.es_admin,
      username: role.username,
      role
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login correcto', token });
  } else {
    // Usuario no encontrado
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }


  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ error: 'Error en el servidor' });
    
  }
  
});
////sign up
app.post('/signup', async (req, res) => {
  try {
    const { name, surname1, surname2, username, email, password,role = "Usuario"} = req.body;
    
    const hashedpassword = await bcrypt.hash(password, 10);//surname = Firstname tambien cambiar surname1 por password
    console.log("Hash generado:", hashedpassword); 
    console.log("Username recibido:", name);

    // Validacion
    const result = await pool.query("INSERT INTO empleados (nombre_empleado, primerapellido_empleado, segundoapellido_empleado, email_empleado,contraseña_empleado,es_admin) VALUES ($1, $2, $3, $4, $5, $6)", [name, surname1, surname2, email, hashedpassword,role]);//convertir a hash
    return res.json({ message: 'signup correcto' }); //mensaje
    
    // if (result.rows.length > 0) {
    //   return res.json({ message: 'signup correcto' }); 
    // } else {
    //   return res.status(401).json({ message: 'signup incorrecto' });
    // }

  } catch (error) {
    console.error("Error en /signup:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/forgotpassword', async(req, res) => {

const  {email} = req.body;

try{
  const result = await pool.query("SELECT * FROM empleados WHERE email_empleado = $1", [email])
  if(result.rows.length === 0){
    return res.status(404).json({ message: "Correo no encontrado" });
    
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 3600000)

  await pool.query(`
  INSERT INTO password_reset_tokens (email_empleado, token, expires_at)
  VALUES ($1, $2, $3)
  ON CONFLICT (email_empleado) DO UPDATE
  SET token = $2, expires_at = $3
`, [email, token, expiresAt]);

const resetUrl = `http://localhost:3000/forgotpassword?token=${token}`;
console.log(`Enlace de recuperación: ${resetUrl}`);


await transporter.sendMail({
  from:'"Soporte tecnico" <no-reply@reto.com>',
  to:email,
  subject: "Recuperar contrasena",
  html:`
  <p>Hola,</p>
  <p>Solicitaste restablecer tu contraseña.</p>
  <p><a href="${resetUrl}">Haz clic aquí para restablecerla</a></p>`
  })
  res.json({message:"Correo enviado"})
}catch (error){
  console.error(error);
    res.status(500).json({ message: "Error del servidor" });
}
})

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
