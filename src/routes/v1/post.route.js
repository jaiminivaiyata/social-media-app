const express = require('express');
const validate = require('../../middlewares/validate');
const { postValidation } = require('../../validations');
const { postController } = require('../../controllers');
const asyncHandler = require('../../middlewares/asyncHandler');
const auth = require('../../middlewares/auth');


const router = express.Router();


router
  .route('/')
  .post(auth('managePosts'), validate(postValidation.createPost), asyncHandler(postController.createPost))
  .get(auth('getPosts'), validate(postValidation.getPosts), asyncHandler(postController.getPosts));

router
  .route('/:postId')
  .get(auth('getPosts'), validate(postValidation.getPost), asyncHandler(postController.getPost))
  .patch(auth('managePosts'), validate(postValidation.updatePost), asyncHandler(postController.updatePost))
  .delete(auth('managePosts'), validate(postValidation.deletePost), asyncHandler(postController.deletePost));


router
  .route('/comment')
  .post(auth('manageComments'), validate(postValidation.createComment), asyncHandler(postController.createComment))

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and retrieval
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post
 *     description: All users can create posts.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post
 *             properties:
 *               post:
 *                 type: string
 *             example:
 *               post: This is my first post
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
 *                    $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all posts with comments
 *     description: All users can view 
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *                      $ref: '#/components/schemas/Post'
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