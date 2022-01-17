const campgroundSchema = require('./Schema');
const reviewSchema = require('./reviewSchema');
const ExpressError = require('./utils/ExpressError');
const campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.review = req.body;
        // req.session.method = (req.originalMethod);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatecampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        console.log('result', result);
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "dont have permission");
        return res.redirect(`/campground/${id}`);
    }
    next();
}
module.exports.isreviewAuthor = async (req, res, next) => {
    const { id, productid } = req.params;
    const review = await Review.findById(productid);
    if (req.user && !review.author.equals(req.user._id)) {
        req.flash('error', "dont have permission");
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    // if (req.session.review) {
    //     req.body = req.session.review;
    //     delete req.session.review;
    // }
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // console.log(req.body)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
