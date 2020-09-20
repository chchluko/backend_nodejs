'use strict'

// Cargar modules de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express (http)
var app = express();

// Cargar ficheros rutas
var article_routes = require('./routes/article')

// Cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



// Añadir prefijos a rutas
app.use('/api',article_routes);

//ruta de prueba

app.get('/probando',(req, res)=>{
//console.log('hola mundo');
var hola = req.body.hola;
/*return res.status(200).send(`<ul>
<li>Node JS</li>
<li>Angular</li>
</ul>`);*/

return res.status(200).send({
	nombre: 'hola', apellido: 'prueba'
});

});


// Exportar modulo (fichero actual)

module.exports = app;