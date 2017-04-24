const TOKEN_TTL = 1000/*ms/s*/*60/*s/min*/*60/*min/hr*/*24/*hours*/;

var express = require('express');
var bcrypt = require('bcrypt');
var hash = require('hash.js')
var app = express();
var ObjectId = require('mongodb').ObjectID;
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

function doElo(d) {
    gClubMembers.findOne({
                   'activity': d.activity,
                   'user': d.user}, function (e, user) {
        if (user && !e) {
            gClubMembers.findOne({
                           'activity': d.activity,
                           'user': d.foe}, function (e, foe) {
                if (foe && !e) {
                    if (Math.abs(user.score - foe.score) <= 400) {
                        var Quser = Math.pow(10, user.score / 400);
                        var Qfoe  = Math.pow(10, foe.score  / 400);
                        var Euser = Quser/(Quser+Qfoe);
                        var Efoe  = Qfoe/(Qfoe+Quser);
                        var Suser = d.user_score / (d.user_score + d.foe_score);
                        var Sfoe  = d.foe_score  / (d.user_score + d.foe_score);
                        user.score += 32 * (Suser - Euser);
                        foe.score  += 32 * (Sfoe  - Efoe);
                    }
                    if (d.user_score == d.foe_score) {
                        user.draws += 1;
                        foe.draws += 1;
                    } else if (d.user_score > d.foe_score) {
                        user.wins += 1;
                        foe.losses += 1;
                    } else {
                        user.losses += 1;
                        foe.wins += 1;
                    }
                    gClubMembers.updateOne({"_id": user._id}, user);
                    gClubMembers.updateOne({"_id": foe._id}, foe);
                }
            });
        }
    });
}

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
        var user = gUsers.findOne({"userl": req.body.user.toLowerCase()},
            function(e, d) {
                try {
                    if (d && !e) {
                        var s = bcrypt.compareSync(req.body.pass, d.pass);
                        if (s) {
                            var _t = (new Date()).getTime() + TOKEN_TTL;
                            d.expiration = _t;
                            d.token = hash.sha256().update(d._id+_t).digest('hex')
                            gUsers.updateOne({"_id": d._id}, d);
                            res.json({'status': true,
                                      'token': d.token,
                                      'user': d.user,});
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
app.post('/score', function(req, res) {
    console.log(req.body.id);
    gChallenges.findOne({"_id": ObjectId(req.body.id)},
        function(e, d) {
            if (!e && d) {
                console.log(d);
                console.log(req.body);
                if (d.status == 'open') {
                    if (req.body.user == d.user) {
                        d.user_score = parseFloat(req.body.userscore);
                        d.foe_score = parseFloat(req.body.foescore);
                    } else {
                        d.foe_score = parseFloat(req.body.userscore);
                        d.user_score = parseFloat(req.body.foescore);
                    }
                    d.status = req.body.user;
                    gChallenges.updateOne({"_id": d._id}, d);
                    res.json({'status': false});
                } else if (d.status == 'closed'){
                    res.json({'status': true});
                } else if (d.status == req.body.user) {
                    if (req.body.user == d.user) {
                        d.user_score = parseFloat(req.body.userscore);
                        d.foe_score = parseFloat(req.body.foescore);
                        gChallenges.updateOne({"_id": d._id}, d);
                        res.json({'status': false});
                    } else {
                        d.foe_score = parseFloat(req.body.userscore);
                        d.user_score = parseFloat(req.body.foescore);
                        gChallenges.updateOne({"_id": d._id}, d);
                        res.json({'status': false});
                    }
                } else if (d.status != req.body.user) {
                    if (req.body.user == d.user) {
                        if (d.user_score == req.body.userscore && 
                            d.foe_score == req.body.foescore) {
                            d.status = 'closed';
                            doElo(d);
                            gChallenges.updateOne({"_id": d._id}, d);
                            res.json({'status': true});
                        } else {
                            res.json({'status': false});
                        }
                    } else {
                        if (d.foe_score == req.body.userscore &&
                            d.user_score == req.body.foescore) {
                            d.status = 'closed';
                            doElo(d);
                            gChallenges.updateOne({"_id": d._id}, d);
                            res.json({'status': true});
                        } else {
                            res.json({'status': false});
                        }
                    }
                } else {
                    res.json({'status': false});
                }
            } else {
                res.json({'status': false});
            }
        });
});
app.post('/newchallenge', function(req, res) {
    gChallenges.insert( {'user'       : req.body.user,
                         'foe'        : req.body.foe,
                         'activity'   : req.body.activity,
                         'status'     : 'open',
                         'user_score' : 0,
                         'foe_score'  : 0},
                         function (err, d) {
                            if (err == null) {
                                res.json({'status': true, 'id': d.ops[0]._id});
                            } else {
                                res.json({'status': false});
                            }
                         });
});
app.post('/challenges', function(req, res) {
    gChallenges.find( {$or:[
                           {'user' : req.body.user,
                            'status': {$not: {$eq: 'closed'}}},
                           {'foe'  : req.body.user,
                            'status': {$not: {$eq: 'closed'}}},
                           ]}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'challenges': d});
            } else {
                res.json({'status': false});
            }
        });

});
app.post('/unfriend', function(req, res) {
    gFriends.remove({'user': req.body.user,
                     'friend': req.body.foe} );
    res.json({'status': true});
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
})
app.get('/clubmembers/:activity/:club', function(req, res) {
    gClubMembers.find({'activity': req.params.activity,
                       'club': req.params.club}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'members': d});
            } else {
                res.json({'status': false});
            }
        });
});
app.get('/myclubs/:user', function(req, res) {
    gClubMembers.find({'user': req.params.user}).toArray(
        function(e, d) {
            if (!e && d) {
                res.json({'status': true, 'clubs': d});
            } else {
                res.json({'status': false});
            }
        });
});
app.post('/joinclub', function(req, res) {
    gClubMembers.insert({'club': req.body.club,
                   'activity': req.body.activity,
                   'user': req.body.user,
                   'score': 1000,
                   'wins': 0,
                   'losses': 0,
                   'draws': 0,});
    res.json({'status': true});
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
    nuser = req.body.user.toLowerCase();
    gUsers.findOne({'userl': nuser}, function(e, d){
            console.log(d);
        if (!d) {
            console.log(e);
            var salt = bcrypt.genSaltSync();
            var hash = bcrypt.hashSync(req.body.pass, bcrypt.genSaltSync());
            gUsers.insert( {'user' : req.body.user,
                            'email': req.body.email,
                            'userl': nuser,
                            'pass' : hash} );
            res.json({'status': true});
        } else {
            res.json({'status': false});
        }
    });
});
  
