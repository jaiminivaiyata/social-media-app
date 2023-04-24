const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { toJSON, paginate } = require('./plugins');
const ApiError = require('../utils/ApiError');

const todosSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        todo: {
            type: String,
            required: true,
        },
        is_completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
todosSchema.plugin(toJSON);
todosSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} todoItem - New todo
 * @param {ObjectId} [excludeTodoId] - The id of the todo to be excluded
 * @returns {Promise<boolean>}
 */
todosSchema.statics.isTodoExists = async function (todoItem, userId, excludeTodoId) {
    const todo = await this.findOne({ todo: todoItem, is_completed: false, user: userId, _id: { $ne: excludeTodoId }});
    if(todo)
    {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Todo item already exists');
    }
    return !!todo;
  };

/**
 * @typedef Token
 */
const Todo = mongoose.model('Todo', todosSchema);

module.exports = Todo;
