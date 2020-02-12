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

// get posts by id
router.get('/:id', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
        .then(post => {
            console.log(post);
            if (!post.length) {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
            else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." });
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
    const newComment = { ...req.body, post_id: id };
    console.log(newComment);

    if (newComment.text === '' || !newComment.text) {
        res.status(400).json({ error: "Please provide text for the comment." });
    }
    else {
        Posts.findById(id)
            .then(post => {
                if (!post) {
                    res.status(404).json({ error: "The post with the specified ID does not exist." });
                }
                else {
                    Posts.insertComment(newComment).then(addedComment => {
                        res.status(201).json(newComment);
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({ error: "There was an error while saving the comment to the database." });
                        })
                }
            })
    }
})

// get post comments by post id
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
        .then(post => {
            if (!post.length) {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
            else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
});

// delete by post id
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Posts.remove(id).then(deleted => {
        console.log(deleted);
        if (deleted === 0) {
            res.status(404).json({ error: "The post with the specified ID does not exist." });
        }
        else {
            res.status(200).json(deleted);
        }
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be removed." });
        });
});

// modify a post
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const editedPost = req.body;

    Posts.findById(id)
        .then(post => {
            if (!post.length) {
                res.status(404).json({ error: "The post with the specified ID does not exist." });
            }
            else if (!editedPost.title || !editedPost.contents) {
                res.status(400).json({ error: "Please provide title and contents for the post." });
            }
            else {
                Posts.update(id, editedPost)
                    .then(newPost => {
                        res.status(200).json(newPost);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "The post information could not be modified." });
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Oops, something went wrong. Try again." });
        })
});

module.exports = router;