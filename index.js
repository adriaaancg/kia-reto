const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const auth = require("./middlewares/auth");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const userRoutes = require("./routes/user.routes");
app.use("/api/users", auth, userRoutes);

const wasteRoutes = require("./routes/waste.routes");
app.use("/api/waste", wasteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});