const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { toJSON, paginate } = require('./plugins');
const ApiError = require('../utils/ApiError');

const commentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: 'Post',
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
