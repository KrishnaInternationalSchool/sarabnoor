const User = require("../models/User");
const Notification = require("../models/Notification");
const { generateToken } = require("../utils/generateToken");
const { validate } = require("../utils/validate");
const { registerSchema, loginSchema } = require("../validators/authValidators");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt
});

const register = async (req, res, next) => {
  try {
    const payload = validate(registerSchema, req.body);
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create(payload);
    await Notification.create({
      user: user._id,
      title: "Welcome to Sarab Noor",
      message: "Your account has been created. Explore campaigns and volunteer opportunities."
    });

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = validate(loginSchema, req.body);
    const user = await User.findOne({ email: payload.email });

    if (!user || !(await user.comparePassword(payload.password))) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    res.json({
      success: true,
      token: generateToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
};

module.exports = { register, login, getMe };
