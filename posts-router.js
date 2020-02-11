const express = require('express');

const Posts = require('./data/db');

const router = express.Router();

// get all posts
router.get('/', (req, res) => {
    Posts.find().then(posts => {
        res.status(200).json(posts);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        })
});

// create new post
router.post('/', (req, res) => {

    const newPost = req.body;

    if (newPost.title === '' || newPost.contents === '') {
        res.status(400).json({ error: "Please provide title and contents for the post." });
    }
    else {
        Posts.insert(newPost).then(added => {
            res.status(201).json(newPost);
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the post to the database." });
            })
    }
});

// create a new comment
router.post('/:id/comments', (req, res) => {

    const { id } = req.params;
    const newComment = req.body;

    Posts.findById(id).then(post => {
        if (!post) {
            res.status(404).json({ error: "The post with the specified ID does not exist." });
        }
        else if (newComment.text.length !== '') {
            Posts.insertComment(newComment).then(added => {
                res.status(201).json(newComment);
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "" })
                })
        }
    })
})

module.exports = router;