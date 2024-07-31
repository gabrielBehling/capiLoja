var express = require('express');
var helmet = require('helmet');
var path = require('path');
var mustache = require('mustache-express');

import mainRouter from './routes/index';

const server = express();

server.use(helmet());
server.use(express.static(path.join(__dirname, '../public')));

server.set('view engine', 'mustache');
server.set('views', path.join(__dirname, 'views'));
server.engine('mustache', mustache());

server.use(mainRouter);

server.listen(process.env.PORT);
