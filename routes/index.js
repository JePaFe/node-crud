const moment = require('moment')

const express = require('express')
const router = express.Router()

const connection = require('../database')

router.get('/', async (req, res) => {
    // connection.query('SELECT * FROM articulos', (error, results, fields) => {
    //     if (error) throw error
    //     res.render('index', {results})
    // })

    const results = await connection.query('SELECT * FROM articulos')
    
    res.render('index', {results})
})

router.get('/show/:id', (req, res) => {
    const {id} = req.params
    connection.query(`SELECT * FROM articulos WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error
        res.render('show', {articulo: results[0]})
    })
})

router.get('/create', (req, res) => {
    res.render('create')
})

router.post('/store', (req, res) => {
    const { titulo, cuerpo, fecha_publicacion } = req.body
    connection.query(`INSERT INTO articulos SET ?`, { titulo, cuerpo, fecha_publicacion }, (error, results, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})

router.get('/edit/:id', (req, res) => {
    const {id} = req.params
    connection.query(`SELECT * FROM articulos WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error
        results[0].fecha_publicacion = moment(results[0].fecha_publicacion).format('YYYY-MM-DD')
        res.render('edit', {articulo: results[0]})
    })
})

router.post('/update/:id', (req, res) => {
    const {id} = req.params
    const { titulo, cuerpo, fecha_publicacion } = req.body
    connection.query(`UPDATE articulos SET ? WHERE id = ${id}`, { titulo, cuerpo, fecha_publicacion }, (error, results, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})

router.get('/destroy/:id', (req, res) => {
    const {id} = req.params
    connection.query(`DELETE FROM articulos WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})

module.exports = router