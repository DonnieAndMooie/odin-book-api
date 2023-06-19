const express = require("express");

const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const commentController = require("../controllers/commentController");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");

router.post("/sign-up", authController.sign_up);

router.post("/login", authController.login);

router.post("/facebook-login", authController.login_facebook);

router.get("/posts", passport.authenticate("jwt", { session: false }), postController.posts_get);

router.get("/posts/:postId", passport.authenticate("jwt", { session: false }), postController.post_get);

router.post("/posts", passport.authenticate("jwt", { session: false }), passport.authenticate("jwt", { session: false }), postController.post_post);

router.delete("/posts/:postId", passport.authenticate("jwt", { session: false }), postController.post_delete);

router.put("/posts/:postId", passport.authenticate("jwt", { session: false }), postController.post_update);

router.get("/posts/:postId/comments", passport.authenticate("jwt", { session: false }), commentController.comments_get);

router.get("/posts/:postId/comments/:commentId", passport.authenticate("jwt", { session: false }), commentController.comment_get);

router.post("/posts/:postId/comments", passport.authenticate("jwt", { session: false }), commentController.comment_post);

router.delete("/posts/:postId/comments/:commentId", passport.authenticate("jwt", { session: false }), commentController.comment_delete);

router.put("/posts/:postId/comments/:commentId", passport.authenticate("jwt", { session: false }), commentController.comment_update);

router.get("/users", passport.authenticate("jwt", { session: false }), userController.users_get);

router.get("/users/:userId", passport.authenticate("jwt", { session: false }), userController.user_get);

router.put("/users/:userId", passport.authenticate("jwt", { session: false }), userController.user_update);

module.exports = router;
