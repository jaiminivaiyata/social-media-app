const mongoose = require('mongoose');
const faker = require('faker');
const Todo = require('../../src/models/todo.model');
const { userOne, userTwo } = require('../fixtures/user.fixture');

const todoOne = {
    _id: new mongoose.Types.ObjectId(),
    todo: faker.lorem.sentence(),
    user: userOne._id,
    is_completed: false,
};

const todoTwo = {
    _id: new mongoose.Types.ObjectId(),
    todo: faker.lorem.sentence(),
    user: userTwo._id,
    is_completed: false,
};

const todoThree = {
    _id: new mongoose.Types.ObjectId(),
    todo: faker.lorem.sentence(),
    user: userTwo._id,
    is_completed: true,
};

const todoFour = {
    _id: new mongoose.Types.ObjectId(),
    todo: faker.lorem.sentence(),
    user: userTwo._id,
    is_completed: false,
};

const insertTodos = async (todos) => {
    await Todo.insertMany(todos);
};

module.exports = {
    todoOne,
    todoTwo,
    todoThree,
    todoFour,
    insertTodos
};
