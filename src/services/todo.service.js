const httpStatus = require('http-status');
const { Todo } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a todo
 * @param {Object} userBody
 * @returns {Promise<Todo>}
 */
const createTodo = async (todoBody) => {
    if (await Todo.isTodoExists(todoBody.todo, todoBody.user.id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Toso item already taken');
    }

    const createObject = {
        todo: todoBody.todo,
        user: todoBody.user.id
    }
    return Todo.create(createObject);
};

/**
 * Query for todos
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTodos = async (filter, options) => {
    const todos = await Todo.paginate(filter, options);
    return todos;
};

/**
 * Get todo by id
 * @param {ObjectId} id
 * @returns {Promise<Todo>}
 */
const getTodoById = async (id) => {
    return Todo.findById(id);
};

/**
 * Get todo by id and user
 * @param {ObjectId} id
 * @param {ObjectId} user
* @returns {Promise<Todo>}
 */
const getTodoByIdAndUser = async (id, user) => {
    return Todo.findOne({_id: id, user: user});
};


/**
 * Update todo by id
 * @param {ObjectId} todoId
 * @param {Object} updateBody
 * @returns {Promise<Todo>}
 */
const updateTodoById = async (todoId, updateBody, userId) => {
    const todo = await getTodoByIdAndUser(todoId, userId);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    if (updateBody.todo && (await Todo.isTodoExists(updateBody.todo, userId, todoId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Todo item already exists');
    }
    Object.assign(todo, updateBody);
    await todo.save();
    return todo;
};

/**
 * Delete todo by id
 * @param {ObjectId} userId
 * @returns {Promise<Todo>}
 */
const deleteTodoById = async (todoId, userId) => {
    const todo = await getTodoByIdAndUser(todoId, userId);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    await todo.deleteOne();
    return todo;
};

module.exports = {
    getTodoById,
    createTodo,
    queryTodos,
    updateTodoById,
    deleteTodoById,
    getTodoByIdAndUser
};
