"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csv');


app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');

app.get('/', (request, response) => {
  response.render('index', { title: 'Analizador CSV' });
});

const Input = require('./models/csv_bd');

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
    Input.find({}, function(err, docs) {
        if (err)
            return err;
        if (docs.length >= 4) {
            Input.find({ name: docs[3].name }).remove().exec();
        }
    });
    let input = new Input({
        "name": req.ejemplo,
        "content": req.query.content
    });

    input.save(function(err) {
        if (err) {
            console.log(`Hubieron errores:\n${err}`);
            return err;
        }
        console.log(`Guardado: ${input}`);
    });
});

/*Se devuelve un array con todas las entradas de la BD como respuesta*/
app.get('/find', function(req, res) {
    Input.find({}, function(err, docs) {
        if (err)
            return err;
        res.send(docs);
    });
});

/*Se devuelve como respuesta la entrada correspondiente al nombre
  especificado en la request*/
app.get('/findByName', function(req, res) {
    Input.find({
        name: req.query.name
    }, function(err, docs) {
        res.send(docs);
    });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}`);
});
