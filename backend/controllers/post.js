const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    //imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    return res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery.then(docs => {
    fetchedPosts = docs;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: fetchedPosts,
      maxPosts: count
    });
  }).catch(err => {
    message: "Fetching Posts Failed"
  });
}

exports.deletePost = (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result) {
      res.status(200).json({ message: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "Not AUthorized" });
    }
  });
}

exports.updatePost = (req, res, next) => {
  //let imagePath = req.body.imagePath;
  //if (req.file) {
  //  const url = req.protocol + '://' + req.get("host");
  //  imagePath = url + "/images/" + req.file.filename
  //}

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    //imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Post Updated!" });
    } else {
      res.status(401).json({ message: "Not AUthorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'Post not found!' });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching Post Failed"
    });
  });
}
