import mongoose from 'mongoose';

/**
 * Post Schema
 * Used for full CRUD operations (Create, Read, Update, Delete)
 */
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional so beginner tests can create posts without first registering a user
    },
    authorName: {
      type: String,
      default: 'Anonymous',
    },
    category: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
