(function() {
  "use strict";
  const util = require('util');
  const mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/csv');
  
  const CardSchema = mongoose.Schema({ 
    "name": { type: String, unique: true },
    "content": String
  });

  const Input = mongoose.model("Input", CardSchema);

  let i1 = new Input({
      "name": "input1.csv",
      "content": ` "producto",           "precio"
                    "camisa",             "4,3"
                    "libro de O\"Reilly", "7,2"`
    });
  
  let i2 = new Input({
      "name": "input2.csv",
      "content": `  "producto",           "precio"  "fecha"
                    "camisa",             "4,3",    "14/01"
                    "libro de O\"Reilly", "7,2"     "13/02"`
  });
  
  let i3 = new Input({
    "name": "input3.csv",
    "content":  ` "edad",  "sueldo",  "peso"
                  ,         "6000€",  "90Kg"
                  47,       "3000€",  "100Kg"`
  });


  let p1 = i1.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${i1}`);
  });

  let p2 = i2.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${i2}`);
  });

  let p3 = i3.save(function (err) {
    if (err) { console.log(`Hubieron errores:\n${err}`); return err; }
    console.log(`Saved: ${i3}`);
  });

  Promise.all([p1, p2, p3]).then( (value) => { 
    console.log(util.inspect(value, {depth: null}));  
    mongoose.connection.close(); 
  });
  
  module.exports = Input;
  
})();