const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "vendor", "customer"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  storeName: {
    type: String,
    required: function () {
      return this.role === "vendor";
    },
  },
  addresses: [
    {
      name: { type: String },
      address: { type: String },
    },
  ],
});

// HASHING USER PASSWORD 
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// COMPARE PASSWORDS 
userSchema.methods.matchPassword = async function(pass) {
    return bcrypt.compare(pass, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = {
  User,
};


