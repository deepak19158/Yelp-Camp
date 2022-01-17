const express = require('express');
const route = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isreviewAuthor, validateReview } = require('../middleware');
const reviewcontroller = require('../controller/review');

route.post('/', isLoggedIn, validateReview, reviewcontroller.post)
route.delete('/:productid', isLoggedIn, isreviewAuthor, catchAsync(reviewcontroller.delete))

module.exports = route;