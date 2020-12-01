const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup'
}))

router.get('/signin', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/profile')
    }

    return next()
}, (req, res) => {
    res.render('auth/signin')
})

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
}))

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/signin')
})

router.get('/profile', (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/signin')
}, (req, res) => {
    res.render('auth/profile', {user: req.user})
})

module.exports = router