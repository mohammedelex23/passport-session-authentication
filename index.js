require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user')
const md5 = require('md5')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const passport = require('passport')
const session = require('express-session')

const app = express();

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost:27017/authenticate', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to mongodb')
})
mongoose.set('useCreateIndex', true)

app.listen(3000, () => {
    console.log('Server listens to port: 3000')
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets')
    } else {
        res.redirect('/login')
    }
})

app.post('/register', (req, res) => {
    User.register({username : req.body.username}, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            res.redirect('/register')
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets')
            })
        }
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.post('/login', (req, res) => {

    const user = User({
        username : req.body.username,
        password : req.body.password
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err)
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets')
            })
        }
    });
})

