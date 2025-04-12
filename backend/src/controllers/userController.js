const { User } = require("../models/User");
const { generateToken } = require("../utils/generateToken");

// REGISTER A USER
const registerUserController = async (req, res) => {
  try {
    const { name, email, password, role, addresses, storeName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email Already Exists" });

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin && role === "admin")
      return res.status(400).json({ msg: "Admin cannot be Created" });

    // Creating a Customer
    if (role === "customer") {
      const user = await User.create({
        name,
        email,
        password,
        role,
        addresses,
      });
      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          addresses: user.addresses,
          token: generateToken(user._id),
        });
      }
    }

    //   CREATING VENDOR
    if (role === "vendor") {
      if (!storeName)
        return res.status(400).json({ msg: "Please Provide a Store Name." });
      const user = await User.create({
        name,
        email,
        password,
        role,
        storeName,
      });
      if (user) {
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          storeName: user.storeName,
          token: generateToken(user._id),
        });
      }
    }

    // CREATING ADMIN
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// LOGIN A USER
const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Email not found" });


    if (password && await user.matchPassword(password)) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName,
        addresses: user.addresses,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ msg: "Incorrect Password" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE USER
const updateUserController = async (req, res) => {
  try {
    const { ...body } = req.body;
    const id = req.params.id;
    //  console.log(typeof req.user._id);

    if (id == req.user._id) {
      const user = await User.findByIdAndUpdate(id, body, { new: true }).select(
        "-password"
      );
      res.status(202).json(user);
    } else {
      res.status(403).json({ msg: "This action is not Allowed for you." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// DELETE USER
const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    if (id == req.user._id || req.user.role === "admin") {
      const user = await User.findByIdAndDelete(id);
      res.status(200).json({ msg: `User ${user._id} have been deleted` });
    } else {
      res.status(403).json({ msg: "This action is not allowed for you." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET CURRENT USER
const getCurrentUserController = async (req, res) => {
  try {
    let user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET USERS
const getUsersController = async (req, res) => {
  try {
    const user = req.user;
    const { u } = req.query;
    if (user.role === "admin") {
      const users = await User.find({ role: u });
      res.status(200).json(users);
    } else if (user.role === "customer") {
      if (u !== "vendor") res.status(403).json({ msg: "Action Forbidden" });
      const users = await User.find({ role: u });
      res.status(200).json(users);
    }else{
      return res.status(403).json({msg: "Action Forbidden"});
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
  updateUserController,
  deleteUserController,
  getCurrentUserController,
  getUsersController
};
