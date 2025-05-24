const express = require("express");
const Joi = require("joi");
const User = require("../models/User");
const { generateToken, authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email or username",
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find user (convert email to lowercase to match schema)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Generate API key endpoint
router.post("/generate-api-key", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const apiKey = user.generateApiKey();
    await user.save();

    res.json({
      message: "API key generated successfully",
      apiKey,
      note: "Store this API key securely. It will not be shown again.",
    });
  } catch (error) {
    console.error("API key generation error:", error);
    res.status(500).json({ message: "Failed to generate API key" });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Revoke API key
router.delete("/revoke-api-key", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    user.apiKey = undefined;
    user.apiKeyActive = false;
    await user.save();

    res.json({ message: "API key revoked successfully" });
  } catch (error) {
    console.error("API key revocation error:", error);
    res.status(500).json({ message: "Failed to revoke API key" });
  }
});

module.exports = router;
