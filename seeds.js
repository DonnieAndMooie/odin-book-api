const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const Post = require("./models/Post");
const Comment = require("./models/Comment");

mongoose.connect(process.env.DATABASE_URL);

async function createNewUser() {
  try {
    const newUser = new User({
      name: faker.person.fullName(),
      friends: [],
      email: faker.internet.email(),
      password: faker.internet.password(),
      picture: faker.image.avatar(),
      requests_received: [],
      requests_sent: [],
      bio: faker.person.bio(),
    });
    console.log(newUser);
    await newUser.save();
  } catch (err) {
    console.log(err);
  }
}

// for (let i = 0; i < 10; i++) {
//   createNewUser();
// }

async function createPost() {
  try {
    const Users = await User.find({});
    const random = Math.floor(Math.random() * Users.length);
    const newPost = new Post({
      text: faker.lorem.text(),
      likes: [],
      author: Users[random]._id,
      timestamp: faker.date.past(),
    });
    await newPost.save();
    console.log(newPost);
  } catch (err) {
    console.log(err);
  }
}

// for (let i = 0; i < 10; i++) {
//   createPost();
// }

async function createComment() {
  try {
    const Posts = await Post.find({});
    const random = Math.floor(Math.random() * Posts.length);
    const Users = await User.find({});
    const random2 = Math.floor(Math.random() * Users.length);
    const newComment = new Comment({
      text: faker.lorem.text(),
      likes: [],
      timestamp: faker.date.past(),
      post: Posts[random]._id,
      author: Users[random2]._id,
    });
    await newComment.save();
    console.log(newComment);
  } catch (err) {
    console.log(err);
  }
}

// for (let i = 0; i < 20; i++) {
//   createComment();
// }

async function makeFriends() {
  const Users = await User.find({});
  const randomNum = Math.floor(Math.random() * Users.length);
  const randomNum2 = Math.floor(Math.random() * Users.length);
  if (randomNum === randomNum2) {
    return;
  }
  const user1 = Users[randomNum];
  const user2 = Users[randomNum2];

  if (user1.friends.includes(user2._id.toString())) {
    return;
  }

  user1.friends.push(user2);
  user2.friends.push(user1);

  await user1.save();
  await user2.save();

  console.log(user1);
  console.log(user2);
}

for (let i = 0; i < 20; i++) {
  makeFriends();
}
