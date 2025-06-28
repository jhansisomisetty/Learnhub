// backend/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, type: user.type }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, type } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, type });

    res.json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
