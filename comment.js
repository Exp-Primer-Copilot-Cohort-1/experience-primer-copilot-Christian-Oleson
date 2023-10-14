// Create web server
const express = require('express');
const router = express.Router();
const db = require('../models');
const { isLoggedIn } = require('./middlewares');

// POST /comment
router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        // create comment
        const comment = await db.Comment.create({
            PostId: req.body.postId,
            UserId: req.user.id,
            content: req.body.content,
        });
        // find comment with user info
        await comment.save();
        const fullComment = await db.Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        // return comment
        return res.json(fullComment);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

// DELETE /comment
router.delete('/:id', isLoggedIn, async (req, res, next) => {
    try {
        // find comment
        const comment = await db.Comment.findOne({
            where: {
                id: req.params.id,
            },
        });
        // if comment exists
        if (comment) {
            // delete comment
            await db.Comment.destroy({
                where: {
                    id: req.params.id,
                },
            });
            // return comment id
            return res.send(req.params.id);
        } else {
            return res.status(404).send('Comment not found');
        }
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;