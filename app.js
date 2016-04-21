"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');


app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');

app.get('/', (request, response) => {
  response.render('index', { title: 'Analizador CSV' });
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.input) });
});

app.param('ejemplo', function (req, res, next, ejemplo) {  
  if (ejemplo.match(/^[a-z_]\w*\.csv$/i)) { 
      req.ejemplo = ejemplo;
  } else { 
      next(new Error(`<${ejemplo}> does not match 'ejemplo' requirements`));
      /* Error: <input1.csx> does not match 'ejemplo' requirements at app.js:85:12 */
   }
  next();
});

// Supongamos que se visita con GET la ruta /mongo/input1.csv
app.get('/mongo/:ejemplo', function(req, res) { 
  console.log(req.params.ejemplo); /* input1.csv */
  console.log(req.ejemplo);        /* input1.csv */

  /* ... Consultar la base de datos y retornar contenidos de input1.csv ... */
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
