const mongoose = require('mongoose');
const campgroundSchema = require('../Schema');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    image: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async (data) => {
    await Review.deleteMany({
        id: { $in: data.reviews }
    })
})

module.exports = mongoose.model('Campground', CampgroundSchema);