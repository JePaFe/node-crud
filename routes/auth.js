const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')

const connection = require('../database')

const passport = require('passport')

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', [
    body('email')
        .isEmail().withMessage('El correo es obligatorio')
        .normalizeEmail(),

    body('email').custom(async value => {
        const rows = await connection.query(`SELECT * FROM users WHERE email = '${value}'`)

        if (rows.length > 0) {
            return Promise.reject('El correo ya esta registrado')
        }
    }),

    body('password')
        .isLength(5).withMessage('La contraseña tiene que tener al menos 5 caracteres'),

    body('password_confirmation').custom((value, {req}) => {
        if(req.body.password !== value) {
            throw new Error('Las contraseña no coinciden')
        }

        return true
    })
], (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.render('auth/signup', {
            errors: errors.array(),
            email: req.body.email
        })
    }

    return next()
}, passport.authenticate('local.signup', {
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

router.post('/signin', [
    body('email')
        .isEmail().withMessage('El correo es obligatorio')
        .normalizeEmail(),

    body('password')
        .isLength(5).withMessage('La contraseña tiene que tener al menos 5 caracteres'),
], (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.render('auth/signin', {
            errors: errors.array(),
            email: req.body.email
        })
    }

    return next()
}, passport.authenticate('local.signin', {
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