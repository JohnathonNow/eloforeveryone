const TOKEN_TTL = 1000/*ms/s*/*60/*s/min*/*60/*min/hr*/*24/*hours*/;

var express = require('express');
var bcrypt = require('bcrypt');
var hash = require('hash.js')
var app = express();
app.use(require('body-parser').json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/john';

var gDB;
var gUsers;
var gChallenges;
var gFriends;
var gActivities;
var gClubs;
var gClubMembers;

MongoClient.connect(url, function(err, db) {
    if (err != null) {
        db.close();
        process.exit();
    } else {
        gDB = db;
        gUsers = db.collection('users');
        gChallenges = db.collection('challenges');
        gFriends = db.collection('friends');
        gActivities = db.collection('activities');
        gClubs = db.collection('clubs');
        gClubMembers = db.collection('clubmembers');
        app.listen(3111);
    }
});
app.post('/login', function(req, res) {
    try {
        var user = gUsers.findOne({"user": req.body.user},
            function(e, d) {
                try {
                    if (d && !e) {
                        var s = bcrypt.compareSync(req.body.pass, d.pass);
                        if (s) {
                            var _t = (new Date()).getTime() + TOKEN_TTL;
                            d.expiration = _t;
                            d.token = hash.sha256().update(d._id+_t).digest('hex')
                            gUsers.updateOne({"_id": d._id}, d);
                            res.json({'status': true, 'token': d.token});
                            return;
                        }
                    }
                } catch(err) {
                    console.log(err);
                }
                res.json({'status': false});
                return;
            });
    } catch(err) {
        console.log(err);
        res.json({'status': false});
        return
    }

});
app.post('/newchallenge', function(req, res) {
    gChallenges.insert( {'user'       : req.body.user,
                         'foe'        : req.body.foe,
                         'status'     : 'open',
                         'user_score' : 0,
                         'foe_score'  : 0} );
    res.json({'status': true});
});
app.post('/challenges', function(req, res) {
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
app.post('/friendlist', function(req, res) {
    gFriends.find({"user": req.body.user}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'friends': d});
            } else {
                res.json({'status': false});
            }
        });
});
app.post('/activities', function(req, res) {
    gActivities.insert({'name': req.body.name});
    res.json({'status': true});
});
app.get('/activities', function(req, res) {
    gActivities.find().toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'activities': d});
            } else {
                res.json({'status': false});
            }
        });
});
app.post('/clubs', function(req, res) {
    gClubs.insert({'name': req.body.name,
                   'activity': req.body.activity,
                   'location': req.body.location,
                   'description': req.body.description,
                   'creator': req.body.user});
    res.json({'status': true});
});
app.get('/clubs/:activity', function(req, res) {
    gClubs.find({'activity': req.params.activity}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'clubs': d, 'activity': req.params.activity});
            } else {
                res.json({'status': false});
            }
        });
});
app.post('/register', function(req, res) {
    console.log(gUsers.find({'user': req.body.user}).limit(1).count());
    if (gUsers.find({'user': req.body.user}).limit(1).count() == 0) {
        var salt = bcrypt.genSaltSync();
        var hash = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync());
        gUsers.insert( {'user' : req.body.user,
                        'email': req.body.email,
                        'pass' : hash} );
        res.json({'status': true});
    } else {
        res.json({'status': false});
    }
});
  
