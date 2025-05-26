const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ username, email, password: hashedPassword, location });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Exclude password in response
    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const { password: _, ...userWithoutPassword } = user._doc;

    return res.json({ token, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user._doc;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};


exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    await updatedUser.save()
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
};