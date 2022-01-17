const campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campground/home', { campgrounds });
};
module.exports.newrender = (req, res) => {
    res.render('campground/new');
};

module.exports.createnew = async (req, res) => {
    const camp = new campground(req.body);
    camp.author = req.user;
    await camp.save();
    req.flash('success', 'New Campground has been created');
    res.redirect('/campground');
};

module.exports.showcampground = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!camp) {
        req.flash('error', "No Such Campground Exist");
        res.redirect('/campground');
    }
    res.render('campground/show', { camp })
};
module.exports.editrender = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp) {
        req.flash('error', "No Such Campground Exist");
        res.redirect('/campground');
    }
    res.render('campground/edit', { camp });
}
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, req.body, { new: true });
    req.flash('success', 'campground updated')
    res.redirect(`/campground/${id}`);
};
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'campground deleted')
    res.redirect("/campground/");

};

module.exports;