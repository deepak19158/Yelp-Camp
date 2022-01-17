const campground = require('../models/campground');
const reviews = require('../models/review')

module.exports.post = async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const newreview = new reviews(review);
    newreview.author = req.user;
    const camp = await campground.findById(id);
    camp.reviews.push(newreview);
    await newreview.save();
    await camp.save();
    req.flash('success', 'Review Posted')
    res.redirect(`/campground/${id}`);

};

module.exports.delete = async (req, res) => {
    const { id, productid } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: productid } });
    const re = await reviews.findByIdAndDelete(productid);
    req.flash('success', 'Review Deleted')
    res.redirect(`/campground/${id}`);

};
module.exports;