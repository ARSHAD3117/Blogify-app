const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-blog", (req, res) => {
  if (!req.user) return res.redirect("/user/signin");
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findOne({ _id: req.params.id }).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  console.log(blog, comments);
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  });
});

router.post("/", upload.single("coverImgUrl"), async (req, res) => {
  console.log(req.body, req.file);
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImgUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  console.log("comment");
  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
