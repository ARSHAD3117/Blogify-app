require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkAuthFromCookie } = require("./middlewares/auth");

const port = process.env.PORT || 8000;
const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthFromCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.listen(port, () => console.log(`Server Started at PORT:${port}`));
