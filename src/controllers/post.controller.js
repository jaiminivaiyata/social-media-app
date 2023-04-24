const httpStatus = require('http-status');

const { postService } = require('../services');
const ApiError = require('../utils/ApiError');
const { sendCommonResponse } = require("../general-components/response");
const commonFunctions = require('../general-components/common-functions');


const createPost = async (request, response) => {
    await postService.createPost({ ...request.body, ...{ user: request.user } });

    const responseObject = {
        code: httpStatus.CREATED,
        data: {},
        message: "New Post created successfully!"
    }
    sendCommonResponse(response, httpStatus.CREATED, responseObject)
};

const updatePost = async (request, response) => {
    const post = await postService.updatePostById(request.params.postId, request.body);

    const responseObject = {
        code: httpStatus.OK,
        data: post,
        message: "Post updated successfully!"
    }
    sendCommonResponse(response, httpStatus.OK, responseObject)
};

const deletePost = async (request, response) => {
    await postService.deletePostById(request.params.postId);
    sendCommonResponse(response, httpStatus.NO_CONTENT)
};

const getPost = async (request, response) => {
    const post = await postService.getPostById(request.params.postId);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    const responseObject = {
        code: httpStatus.OK,
        data: post,
        message: ""
    }
    sendCommonResponse(response, httpStatus.OK, responseObject)
};

const getPosts = async (request, response) => {
    const filter = commonFunctions.pick(request.query, ['post']);
    const options = commonFunctions.pick(request.query, ['sortBy', 'limit', 'page', 'populate']);
    options.populate = 'user,comment';
    const postList = await postService.queryPosts(filter, options);

    const responseObject = {
        code: httpStatus.OK,
        data: postList,
        message: ""
    }
    sendCommonResponse(response, httpStatus.OK, responseObject)
};


const createComment = async (request, response) => {
    await postService.createComment({ ...request.body, ...{ user: request.user } });

    const responseObject = {
        code: httpStatus.CREATED,
        data: {},
        message: "New comment added successfully!"
    }
    sendCommonResponse(response, httpStatus.CREATED, responseObject)
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    createComment
};
