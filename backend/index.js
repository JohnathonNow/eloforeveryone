var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
app.use(require('body-parser').json())
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/john';
var gDB;
var gUsers;
var gChallenges;
MongoClient.connect(url, function(err, db) {
    if (err != null) {
        db.close();
        process.exit();
    } else {
        gDB = db;
        gUsers = db.collection('users');
        gChallenges = db.collection('challenges');
        app.listen(3111);
    }
});
app.post('/', function(req, res) {
    //TODO: Generate session token
        //Consider hash(username+expiration)
    var user = gUsers.findOne({"email": req.body.email},
        function(e, d) {
            if (d) {
                var s = bcrypt.compareSync(req.body.pass, d.pass);
                res.json({'status': s});
            } else {
                res.json({'status': false});
            }
        });

});
app.post('/login', function(req, res) {
    //TODO: Generate session token
        //Consider hash(username+expiration)
    var user = gUsers.findOne({"email": req.body.email},
        function(e, d) {
            if (d) {
                var s = bcrypt.compareSync(req.body.pass, d.pass);
                res.json({'status': s});
            } else {
                res.json({'status': false});
            }
        });

});
app.post('/challenges', function(req, res) {
    gChallenges.find({"email": req.body.email}).toArray(
        function(e, d) {
            if (!e && d) {
                console.log(d);
                res.json({'status': true, 'challenges': d});
            } else {
                res.json({'status': false});
            }
        });

});
app.post('/register', function(req, res) {
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync());
    gUsers.insert( {'email': req.body.email,
                  'pass' : hash,
                  'friends': []} );
    res.json({'status': false});
});
  
