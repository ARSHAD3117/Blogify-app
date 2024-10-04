const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { generateToken, checkAuth } = require("../services/auth");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
    },
    profileImg: {
      type: String,
      default: "/images/download.jpg",
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerareToken",
  async function (email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User Not Found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const matchPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const isMatched = hashedPassword === matchPassword;
    if (!isMatched) throw new Error("Incorrect password");

    const token = generateToken(user);
    return token;
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
