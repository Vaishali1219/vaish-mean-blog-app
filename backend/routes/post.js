const express = require("express");
const checkAuth = require("../middleware/check-auth");
const PostControllers = require("../controllers/post")
const router = express.Router();
const extractFile = require("../middleware/file");

router.post("", checkAuth, extractFile, PostControllers.createPost);

router.get("", PostControllers.getPosts);

router.delete("/:id", checkAuth, PostControllers.deletePost);

router.put("/:id", checkAuth, extractFile, PostControllers.updatePost);

router.get("/:id", PostControllers.getPost);

module.exports = router;
