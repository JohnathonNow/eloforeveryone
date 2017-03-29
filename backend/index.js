var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
app.use(require('body-parser').json())
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/john';
var gDB;
var gCol;
MongoClient.connect(url, function(err, db) {
    if (err != null) {
        db.close();
        process.exit();
    } else {
        gDB = db;
        gCol = db.collection('users');
        app.listen(3111);
    }
});
app.post('/login', function(req, res) {
    var user = gCol.findOne({"email": req.body.email},
        function(e, d) {
            if (d) {
                var s = bcrypt.compareSync(req.body.pass, d.pass);
                res.json({'status': s});
            } else {
                res.json({'status': false});
            }
        });

});
app.get('/register', function(req, res) {
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync("bacon", bcrypt.genSaltSync());
    gCol.insert( {'email': 'johnjwesthoff@gmail.com',
                  'pass' : hash} );
    gCol.find().toArray(function(err, docs) {
        var me = docs[0];
        var d = bcrypt.compareSync("bacon", me.pass);
        //res.json(d);
        res.json(docs);
    });
});
  
