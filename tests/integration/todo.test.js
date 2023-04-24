const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Todo } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, userTwoAccessToken } = require('../fixtures/token.fixture');
const { todoOne, insertTodos, todoTwo, todoThree, todoFour } = require('../fixtures/todo.fixture');


setupTestDB();

describe('Todos routes', () => {
    describe('POST /v1/todos', () => {
        let newTodo;

        beforeEach(async () => {
            newTodo = {
                todo: faker.lorem.sentence(),
            };
        });

        test('should return 201 and successfully create new todo item if data is ok', async () => {

            await insertUsers([userOne]);

            const res = await request(app)
                .post('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newTodo)
                .expect(httpStatus.CREATED);

            expect(res.body.code).toBe(httpStatus.CREATED);
            expect(res.body.data).toEqual({
                id: expect.anything(),
                todo: newTodo.todo,
                user: expect.anything(),
                is_completed: false,
            });

            const dbTodo = await Todo.findById(res.body.data.id);
            expect(dbTodo).toBeDefined();
            expect(dbTodo).toMatchObject({ todo: newTodo.todo, user: userOne._id, is_completed: false });
        });

        test('should return 401 error if access token is missing', async () => {
            await request(app).post('/v1/todos').send(newTodo).expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 400 error if todo item is already used', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne])
            newTodo.todo = todoOne.todo;

            await request(app)
                .post('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newTodo)
                .expect(httpStatus.BAD_REQUEST);
        });
    });

    describe('GET /v1/todos', () => {
        test('should return 200 and apply the default query options', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo, todoThree]);

            const res = await request(app)
                .get('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.OK);

            expect(res.body.code).toBe(httpStatus.OK);
            expect(res.body.data).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 3,
            });
            expect(res.body.data.results).toHaveLength(3);
            expect(res.body.data.results[0]).toEqual({
                id: todoOne._id.toHexString(),
                todo: todoOne.todo,
                is_completed: todoOne.is_completed,
                user: todoOne.user.toHexString(),
            });
        });

        test('should return 401 if access token is missing', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo, todoThree]);

            await request(app).get('/v1/todos').send().expect(httpStatus.UNAUTHORIZED);
        });

        test('should correctly apply filter on is_completed field', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo, todoThree]);

            const res = await request(app)
                .get('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .query({ is_completed: todoThree.is_completed })
                .send()
                .expect(httpStatus.OK);

            expect(res.body.data).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 1,
            });
            expect(res.body.data.results).toHaveLength(1);
            expect(res.body.data.results[0].id).toBe(todoThree._id.toHexString());
        });

        test('should correctly apply filter on user field', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo, todoThree]);

            const res = await request(app)
                .get('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .query({ user: userOne._id.toHexString() })
                .send()
                .expect(httpStatus.OK);

            expect(res.body.data).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 1,
            });
            expect(res.body.data.results).toHaveLength(1);
            expect(res.body.data.results[0].user).toBe(userOne._id.toHexString());
        });

        test('should limit returned array if limit param is specified', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo, todoThree]);

            const res = await request(app)
                .get('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .query({ limit: 2 })
                .send()
                .expect(httpStatus.OK);

            expect(res.body.data).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 2,
                totalPages: 2,
                totalResults: 3,
            });
            expect(res.body.data.results).toHaveLength(2);
            expect(res.body.data.results[0].id).toBe(todoOne._id.toHexString());
            expect(res.body.data.results[1].id).toBe(todoTwo._id.toHexString());
        });

        test('should return the correct page if page and limit params are specified', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo, todoThree]);

            const res = await request(app)
                .get('/v1/todos')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .query({ page: 2, limit: 2 })
                .send()
                .expect(httpStatus.OK);

            expect(res.body.data).toEqual({
                results: expect.any(Array),
                page: 2,
                limit: 2,
                totalPages: 2,
                totalResults: 3,
            });
            expect(res.body.data.results).toHaveLength(1);
            expect(res.body.data.results[0].id).toBe(todoThree._id.toHexString());
        });
    });

    describe('GET /v1/todos/:todoId', () => {
        test('should return 200 and the todo object if data is ok', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);

            const res = await request(app)
                .get(`/v1/todos/${todoOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.OK);

            expect(res.body.data).toEqual({
                id: todoOne._id.toHexString(),
                todo: todoOne.todo,
                user: todoOne.user.toHexString(),
                is_completed: todoOne.is_completed,
            });
        });

        test('should return 401 error if access token is missing', async () => {
            await insertTodos([todoOne]);
            await request(app).get(`/v1/todos/${todoOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 error if user is trying to get another user\'s todo', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo]);

            await request(app)
                .get(`/v1/todos/${todoTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.NOT_FOUND);
        });

        test('should return 400 error if todoId is not a valid mongo id', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);

            await request(app)
                .get('/v1/todos/invalidId')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.BAD_REQUEST);
        });

        test('should return 404 error if user is not found', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);

            await request(app)
                .get(`/v1/todos/${todoTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.NOT_FOUND);
        });
    });

    describe('DELETE /v1/todos/:todoId', () => {
        test('should return 204 if data is ok', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne])

            await request(app)
                .delete(`/v1/todos/${todoOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.NO_CONTENT);

            const dbTodo = await Todo.findById(todoOne._id);
            expect(dbTodo).toBeNull();
        });

        test('should return 401 error if access token is missing', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne])

            await request(app).delete(`/v1/todos/${todoOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 error if user is trying to delete another user\'s todo item', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo])

            await request(app)
                .delete(`/v1/todos/${todoTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.NOT_FOUND);
        });

        test('should return 400 error if todoId is not a valid mongo id', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo])

            await request(app)
                .delete('/v1/todos/invalidId')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.BAD_REQUEST);
        });

        test('should return 404 error if todo already is not found', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);

            await request(app)
                .delete(`/v1/todos/${todoTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(httpStatus.NOT_FOUND);
        });
    });

    describe('PATCH /v1/todos/:todoId', () => {
        test('should return 200 and successfully update todo item if data is ok', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);

            const updateBody = {
                todo: faker.lorem.sentence(),
                is_completed: true,
            };

            const res = await request(app)
                .patch(`/v1/todos/${todoOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(httpStatus.OK);

            expect(res.body.data).toEqual({
                id: todoOne._id.toHexString(),
                todo: updateBody.todo,
                is_completed: updateBody.is_completed,
                user: todoOne.user.toHexString(),
            });

            const dbTodo = await Todo.findById(todoOne._id);
            expect(dbTodo).toBeDefined();
            expect(dbTodo).toMatchObject({ todo: updateBody.todo, is_completed: updateBody.is_completed });
        });

        test('should return 401 error if access token is missing', async () => {
            await insertTodos([todoOne]);
            const updateBody = { todo: faker.lorem.sentence() };

            await request(app).patch(`/v1/todos/${todoOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
        });

        test('should return 404 if user is updating another user\'s todo', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne, todoTwo]);
            const updateBody = { todo: faker.lorem.sentence() };

            await request(app)
                .patch(`/v1/todos/${todoTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(httpStatus.NOT_FOUND);
        });

        test('should return 404 if user is updating his todo item that is not found', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);
            const updateBody = { todo: faker.lorem.sentence() };

            await request(app)
                .patch(`/v1/todos/${todoTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(httpStatus.NOT_FOUND);
        });

        test('should return 400 error if todoId is not a valid mongo id', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);
            const updateBody = { todo: faker.lorem.sentence() };

            await request(app)
                .patch(`/v1/todos/invalidId`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(httpStatus.BAD_REQUEST);
        });

        test('should return 400 if todo item is already exist', async () => {
            await insertUsers([userTwo]);
            await insertTodos([todoFour, todoTwo]);
            const updateBody = { todo: todoTwo.todo };

            await request(app)
                .patch(`/v1/todos/${todoFour._id}`)
                .set('Authorization', `Bearer ${userTwoAccessToken}`)
                .send(updateBody)
                .expect(httpStatus.BAD_REQUEST);
        });

        test('should not return 400 if todo item is my todo item', async () => {
            await insertUsers([userOne]);
            await insertTodos([todoOne]);
            const updateBody = { todo: todoOne.todo };

            await request(app)
                .patch(`/v1/todos/${todoOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(httpStatus.OK);
        });

    });
});
