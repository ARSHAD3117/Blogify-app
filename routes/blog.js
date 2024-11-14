const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const { ImageUploadUtil, upload } = require("../helpers/cloudinary");

const router = Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve("./public/uploads/"));
//   },
//   filename: function (req, file, cb) {
//     const filename = `${Date.now()}-${file.originalname}`;
//     cb(null, filename);
//   },
// });

// const upload = multer({ storage: storage });

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

const handleImgUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await ImageUploadUtil(url);

    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImgUrl: result.url,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error occured",
    });
  }
};

router.post("/", upload.single("coverImgUrl"), handleImgUpload);

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
