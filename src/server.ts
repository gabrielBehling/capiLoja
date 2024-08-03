var express = require('express');
var helmet = require('helmet');
var path = require('path');
var mustache = require('mustache-express');

import mainRouter from './routes/index';
import productsRouter from './routes/products';
import sellersRouter from './routes/sellers';

const server = express();

server.use(helmet());
server.use(express.static(path.join(__dirname, '../public')));

server.set('view engine', 'mustache');
server.set('views', path.join(__dirname, 'views'));
server.engine('mustache', mustache());

server.use(mainRouter);
server.use('/products', productsRouter);
server.use('/sellers', sellersRouter);

server.use((req, res) => {
	res.render('pages/404');
});

server.listen(process.env.PORT);
