const express = require("express");
const app = express();
const sequelize = require("./config");
const User = require("./models/user");
const cors = require("cors");

// Middleware to parse JSON data from incoming requests
app.use(express.json());

// Allow all origins for CORS 
app.use(cors());

// static files
app.use(express.static("public"));

// API to add a user
app.post("/api/add-user", async (req, res) => {
  try {
    const { name, email, phone, call_date, call_time } = req.body;
    const newUser = await User.create({
      name,
      email,
      phone,
      call_date,
      call_time,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create user" });
  }
});

// API to get all users
app.get("/api/get-users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
});

// API to get a user by id
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve user" });
  }
});

// API to Edit a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email, phone, call_date, call_time } = req.body;
    const updatedUser = await User.update(
      { name, email, phone, call_date, call_time },
      { where: { id: req.params.id } }
    );
    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update user" });
  }
});

// API to delete a user
app.delete("/api/delete-user/:id", async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
});

sequelize.sync().then(() => {
  app.listen(3000);
});
