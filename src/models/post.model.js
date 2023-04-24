const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { toJSON, paginate } = require('./plugins');
const ApiError = require('../utils/ApiError');

const postSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: String,
            required: true,
        },
        comment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
