const httpStatus = require('http-status');
const lodash = require("lodash");
const { ObjectId } = require('mongodb');

const { Post, Comment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a post
 * @param {Object} PostBody
 * @returns {Promise<Post>}
 */
const createPost = async (PostBody) => {

    const createObject = {
        post: PostBody.post,
        user: PostBody.user.id
    }
    return Post.create(createObject);
};

/**
 * Query for posts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPosts = async (filter, options) => {
    const posts = await Post.paginate(filter, options);
    return posts;
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
    return Post.findById(id);
};

/**
 * Update post by id
 * @param {ObjectId} PostId
 * @param {Object} updateBody
 * @returns {Promise<Post>}
 */
const updatePostById = async (PostId, updateBody) => {
    const post = await getPostById(PostId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    Object.assign(post, updateBody);
    await post.save();
    return post;
};

/**
 * Delete post by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deletePostById = async (userId) => {
    const Post = await getPostById(userId);
    if (!Post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    await Post.deleteOne(Post);
    return Post;
};


/**
 * Create a post
 * @param {Object} CommentBody
 * @returns {Promise<Post>}
 */
const createComment = async (commentBody) => {

    const createObject = {
        post: commentBody.postId,
        user: commentBody.user.id,
        comment: commentBody.comment
    }

    const createdComment = await Comment.create(createObject);

    await Post.findOneAndUpdate({_id: commentBody.postId}, {$push: {comment: createdComment.id}})

    return createdComment;
};

/**
 * Get comments by post ids
 * @param {ObjectId} postIds
 * @returns {Promise<Comment>}
 */
const getCommentsByPostIds = async (postIds) => {
    return Comment.find({ "post": { $in: postIds } });
};
module.exports = {
    getPostById,
    createPost,
    queryPosts,
    updatePostById,
    deletePostById,
    createComment,
    getCommentsByPostIds
};
