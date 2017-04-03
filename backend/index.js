var express = require('express');
var bcrypt = require('bcrypt');
var app = express();
app.use(require('body-parser').json())
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/john';
var gDB;
var gUsers;
var gChallenges;
var gFriends;
MongoClient.connect(url, function(err, db) {
    if (err != null) {
        db.close();
        process.exit();
    } else {
        gDB = db;
        gUsers = db.collection('users');
        gChallenges = db.collection('challenges');
        gFriends = db.collection('friends');
        app.listen(3111);
    }
});
app.post('/login', function(req, res) {
    //TODO: Generate session token
        //Consider hash(username+expiration)
    var user = gUsers.findOne({"user": req.body.user},
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
    gChallenges.insert( {'user' : req.body.user,
                         'foe'  : req.body.foe} );
    res.json({'status': true});
});
app.put('/challenges', function(req, res) {
    gChallenges.find({$or:[{'user' : req.body.user},
                           {'foe'  : req.body.user}]}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'challenges': d});
            } else {
                res.json({'status': false});
            }
        });

});
app.post('/friends', function(req, res) {
    gFriends.insert({'user': req.body.user,
                     'friend': req.body.friend} );
    res.json({'status': true});
});
app.put('/friends', function(req, res) {
    gFriends.find({"user": req.body.user}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'friends': d});
            } else {
                res.json({'status': false});
            }
        });

});
app.post('/register', function(req, res) {
    var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync());
    gUsers.insert( {'user': req.body.user,
                    'pass' : hash} );
    res.json({'status': true});
});
  
