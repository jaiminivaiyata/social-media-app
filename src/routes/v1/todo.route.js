const express = require('express');
const validate = require('../../middlewares/validate');
const { todoValidation } = require('../../validations');
const { todoController } = require('../../controllers');
const asyncHandler = require('../../middlewares/asyncHandler');
const auth = require('../../middlewares/auth');


const router = express.Router();


router
  .route('/')
  .post(auth('manageTodos'), validate(todoValidation.createTodo), asyncHandler(todoController.createTodo))
  .get(auth('getTodos'), validate(todoValidation.getTodos), asyncHandler(todoController.getTodos));

router
  .route('/:todoId')
  .get(auth('getTodos'), validate(todoValidation.getTodo), asyncHandler(todoController.getTodo))
  .patch(auth('manageTodos'), validate(todoValidation.updateTodo), asyncHandler(todoController.updateTodo))
  .delete(auth('manageTodos'), validate(todoValidation.deleteTodo), asyncHandler(todoController.deleteTodo));

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Todo management and retrieval
 */

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a todo
 *     description: All users can create todos.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - todo
 *             properties:
 *               todo:
 *                 type: string
 *             example:
 *               todo: new todo item for me
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                    type: integer
 *                 message:
 *                    type: string
 *                 data:
 *                    $ref: '#/components/schemas/Todo'
 *       "400":
 *         $ref: '#/components/responses/DuplicateTodo'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all todos
 *     description: All users can view 
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: User name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo item
 *     description: Logged in users can fetch their own todo items.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                    type: integer
 *                 message:
 *                    type: string
 *                 data:
 *                    $ref: '#/components/schemas/Todo'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a todo
 *     description: Logged in users can only update their own todo item.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todo:
 *                 type: string
 *               is_completed:
 *                 type: boolean
 *                 description: to mark a todo item as completed
 *             example:
 *               todo: updated todo item
 *               is_completed: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                    type: integer
 *                 message:
 *                    type: string
 *                 data:
 *                    $ref: '#/components/schemas/Todo'
 *       "400":
 *         $ref: '#/components/responses/DuplicateTodo'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a todo
 *     description: Logged in users can delete only their todo items.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Todo id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
