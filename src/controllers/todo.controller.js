const httpStatus = require('http-status');

const { todoService } = require('../services');
const ApiError = require('../utils/ApiError');
const { sendCommonResponse } = require("../general-components/response");
const commonFunctions = require('../general-components/common-functions');



const createTodo = async (request, response) => {
    const todo = await todoService.createTodo({ ...request.body, ...{ user: request.user } });

    const responseObject = {
        code: httpStatus.CREATED,
        data: todo,
        message: "New Todo item created successfully!"
    }
    sendCommonResponse(response, httpStatus.CREATED, responseObject)
};

const updateTodo = async (request, response) => {
    const todo = await todoService.updateTodoById(request.params.todoId, request.body, request.user.id);

    const responseObject = {
        code: httpStatus.OK,
        data: todo,
        message: "Todo item updated successfully!"
    }
    sendCommonResponse(response, httpStatus.OK, responseObject)
};

const deleteTodo = async (request, response) => {
    await todoService.deleteTodoById(request.params.todoId, request.user.id);
    sendCommonResponse(response, httpStatus.NO_CONTENT)
};

const getTodo = async (request, response) => {
    const todo = await todoService.getTodoByIdAndUser(request.params.todoId, request.user.id);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    const responseObject = {
        code: httpStatus.OK,
        data: todo,
        message: ""
    }
    sendCommonResponse(response, httpStatus.OK, responseObject)
};

const getTodos = async (request, response) => {
    const filter = commonFunctions.pick(request.query, ['todo', 'is_completed', 'user']);
    const options = commonFunctions.pick(request.query, ['sortBy', 'limit', 'page']);
    const result = await todoService.queryTodos(filter, options);
    const responseObject = {
        code: httpStatus.OK,
        data: result,
        message: ""
    }
    sendCommonResponse(response, httpStatus.OK, responseObject)
};



module.exports = {
    createTodo,
    updateTodo,
    deleteTodo,
    getTodo,
    getTodos
};
