const express = require('express')
const router = express.Router()

router.get('/uploads', (req, res) => {
    res.render('uploads')
})

router.post('/uploads', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let imagen = req.files.imagen

    let nombre = imagen.name.split('.')
    let extension = nombre[nombre.length-1]

    let extensiones = ['png', 'jpg', 'jpeg']

    if (extensiones.indexOf(extension) == -1) {
        return res.status(400).send('La extension no esta permitida')
    }

    imagen.mv(`uploads/${imagen.name}`, (error) => {
        if (error) {
            return res.status(500).send(error)
        }

        res.send('File uploaded!')
    })
})

module.exports = router