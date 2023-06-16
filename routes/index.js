const express = require("express");

const router = express.Router();
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");

router.post("/sign-up", authController.sign_up);

router.post("/login", authController.login);

router.post("/facebook-login", authController.login_facebook);

router.get("/posts", postController.posts_get);

router.get("/posts/:postId", postController.post_get);

router.post("/posts", postController.post_post);

router.delete("/posts", postController.post_delete);

router.put("/posts/:postId", postController.post_update);

router.get("/posts/:postId/comments", commentController.comments_get);

router.get("/posts/:postId/comments/:commentId", commentController.comment_get);

router.post("/posts/:postId/comments", commentController.comment_post);

router.delete("/posts/:postId/comments/:commentId", commentController.comment_delete);

router.put("/posts/:postId/comments/:commentId", commentController.comment_update);

router.get("/users", userController.users_get);

router.get("/users/:userId", userController.user_get);

router.put("/users/:userId", userController.user_update);

module.exports = router;
