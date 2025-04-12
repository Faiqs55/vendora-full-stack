const express = require("express");
const {
  registerUserController,
  loginUserController,
  updateUserController,
  deleteUserController,
  getCurrentUserController,
  getUsersController,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.put("/:id", protect, updateUserController);
userRouter.delete("/:id", protect, deleteUserController);
userRouter.get("/user", protect, getCurrentUserController);
userRouter.get("/users", protect, getUsersController);

module.exports = {
  userRouter,
};
