const express = require('express')
const app = express()
const moment = require('moment')
const exphbs = require('express-handlebars')

const mysql = require('mysql')
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'codo_a_codo'
})
connection.connect();

const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: false}))

app.engine('.hbs', exphbs())
app.set('view engine', '.hbs')

app.get('/', (req, res) => {
    connection.query('SELECT * FROM articulos', (error, results, fields) => {
        if (error) throw error
        res.render('index', {results})
    })
})

app.get('/show/:id', (req, res) => {
    const {id} = req.params
    connection.query(`SELECT * FROM articulos WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error
        res.render('show', {articulo: results[0]})
    })
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/store', (req, res) => {
    const { titulo, cuerpo, fecha_publicacion } = req.body
    connection.query(`INSERT INTO articulos SET ?`, { titulo, cuerpo, fecha_publicacion }, (error, results, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})

app.get('/edit/:id', (req, res) => {
    const {id} = req.params
    connection.query(`SELECT * FROM articulos WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error
        results[0].fecha_publicacion = moment(results[0].fecha_publicacion).format('YYYY-MM-DD')
        res.render('edit', {articulo: results[0]})
    })
})

app.post('/update/:id', (req, res) => {
    const {id} = req.params
    const { titulo, cuerpo, fecha_publicacion } = req.body
    connection.query(`UPDATE articulos SET ? WHERE id = ${id}`, { titulo, cuerpo, fecha_publicacion }, (error, results, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})

app.get('/destroy/:id', (req, res) => {
    const {id} = req.params
    connection.query(`DELETE FROM articulos WHERE id = ${id}`, (error, results, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

//connection.end()