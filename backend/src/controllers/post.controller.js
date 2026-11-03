import Post from '../models/post.model.js';

/**
 * @desc    Create a new post (CRUD - Create)
 * @route   POST /api/posts
 * @access  Public
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, author, authorName, category } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the post',
      });
    }

    const newPost = await Post.create({
      title,
      content,
      author: author || undefined,
      authorName: authorName || 'Anonymous',
      category: category || 'General',
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all posts (CRUD - Read All)
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve posts',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single post by ID (CRUD - Read One)
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a post by ID (CRUD - Update)
 * @route   PUT /api/posts/:id
 * @access  Public
 */
export const updatePost = async (req, res) => {
  try {
    const { title, content, category, authorName } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with ID: ${req.params.id}`,
      });
    }

    // Update only provided fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (authorName) post.authorName = authorName;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a post by ID (CRUD - Delete)
 * @route   DELETE /api/posts/:id
 * @access  Public
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with ID: ${req.params.id}`,
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message,
    });
  }
};
