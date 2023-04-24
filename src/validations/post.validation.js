const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPost = {
  body: Joi.object().keys({
    post: Joi.string().required(),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.required().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      post: Joi.string(),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId).required(),
  }),
};


const getPosts = {
  query: Joi.object().keys({
    post: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId).required(),
  }),
};


const createComment = {
  body: Joi.object().keys({
    postId: Joi.string().custom(objectId).required(),
    comment: Joi.string().required()
  }),
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
  createComment
};
