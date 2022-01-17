const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const campgroundRoute = require('./routes/campgroundroute');
const reviewRoute = require('./routes/reviewroute');
const userRoute = require('./routes/userroute')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DAtabsae connected");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/V'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'secretornothing',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoute);
app.use('/campground', campgroundRoute);
app.use('/campground/:id/review/', reviewRoute);

app.get('/fakeuser', async (req, res) => {
    const user = new User({ username: 'deep', email: 'deep@gmail.com' });
    const newUser = await User.register(user, 'password');
    console.log(newUser);
    res.send(newUser);
})
app.get('/validate', async (req, res) => {
    const authenticate = User.authenticate();
    const validated = await authenticate('deep', 'password');
    res.send(validated);
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Something is not good', 401));
})

app.use((err, req, res, next) => {
    res.send(err.message);
})

app.listen(3000, () => {
    console.log('Serving 3000 ')
})