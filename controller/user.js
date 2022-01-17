const User = require('../models/user');

module.exports.renderregister = (req, res) => {
    res.render('user/register')
};
module.exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const newuser = await User.register(user, password);
        req.logIn(newuser, (err) => {
            if (err) return next(err);
            req.flash('success', 'welcome to yelp camp');
            res.redirect('campground');
        })

    } catch (e) {
        // console.log(e);
        req.flash('error', e.message);
        res.redirect('register');
    }
};
module.exports.renderlogin = (req, res) => {
    res.render('user/login');
};

module.exports.login = async (req, res) => {
    // for posting review withot login
    const url = req.session.returnTo || '/campground';
    req.flash('success', 'welcome back');
    delete req.session.returnTo;
    res.redirect(url);
    // if (method === ('POST')) {
    //     res.redirect(307, url)
    // } else {
    //     res.redirect(url);
    // }
};
module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/campground');
};