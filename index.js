const express = require('express');

const postsRouter = require('./posts-router');

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
    res.send(`We outchea working.`);
});

server.listen(8000, () => {
    console.log(`running on port 8000`);
});