const express = require('express');
const route = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validatecampground, isAuthor } = require('../middleware');
const campgroundController = require('../controller/campgrounds');

route.get('/', catchAsync(campgroundController.index));

route.get('/new', isLoggedIn, campgroundController.newrender);

route.post('/new', isLoggedIn, validatecampground, catchAsync(campgroundController.createnew));

route.get('/:id', catchAsync(campgroundController.showcampground));

route.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editrender));

route.put('/:id/edit', isLoggedIn, isAuthor, validatecampground, catchAsync(campgroundController.edit));

route.delete('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.delete))

module.exports = route;
