const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTodo = {
  body: Joi.object().keys({
    todo: Joi.string().required(),
  }),
};

const updateTodo = {
  params: Joi.object().keys({
    todoId: Joi.required().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      is_completed: Joi.boolean(),
      todo: Joi.string(),
    })
    .min(1),
};

const deleteTodo = {
  params: Joi.object().keys({
    todoId: Joi.string().custom(objectId).required(),
  }),
};

const getTodos = {
  query: Joi.object().keys({
    todo: Joi.string(),
    is_completed: Joi.string(),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTodo = {
  params: Joi.object().keys({
    todoId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
  getTodo
};
