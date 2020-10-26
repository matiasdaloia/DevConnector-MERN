const express = require("express");
const { connect } = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");

connectDB();

// Init BodyParser :

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define Routes :
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
