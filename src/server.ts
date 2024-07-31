var express = require('express');
var helmet = require('helmet');
var path = require('path');

const server = express();

server.use(helmet());
server.use(express.static(path.join(__dirname, '../public')));

server.get('/', (req, res) => {
	res.send('Running');
});

server.listen(process.env.PORT);
