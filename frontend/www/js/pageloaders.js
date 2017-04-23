function populateClubInfo() {
    $.get({
        url: 'http://johnwesthoff.com:3111/clubmembers/'+
            gSelAct + "/" + gSelClub,
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                gClubInfo = responseData.members;
                console.log(gClubInfo);
                $('#actclubinfo').empty();
                if (gClubInfo) {
                    console.log(gClubInfo);
                    var header = '<div id="container">'+
                              '<div>User</div><div>Wins</div><div>'+
                              'Losses</div><div>Draws</div>';
                    $('#actclubinfo').append(header);
                    for (var i = 0; i < gClubInfo.length; i += 1) {
                        var name = gClubInfo[i]['user'];
                        var wins = gClubInfo[i]['wins'];
                        var loss = gClubInfo[i]['losses'];
                        var draw = gClubInfo[i]['draws'];
                        var row = '<div id="container">'+
                                  '<div>'+name+'</div><div>'+wins+
                                  '</div><div>'+loss+'</div><div>'+draw+
                                  '</div>';
                        var newfriend='<div class=\'friend\'\
                                       id=\'clubin'+i+'\'\
                                       onclick=\'onfriendclub('+i+');\'\
                                       >'+row+'</div>';
                        $('#actclubinfo').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateClubs() {
    $.get({
        url: 'http://johnwesthoff.com:3111/clubs/'+gSelAct,
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                var clubs = responseData.clubs;
                gClubNum = 0;
                $('#activityclublist').empty();
                if (clubs) {
                    for (var i = 0; i < clubs.length; i += 1) {
                        var name = clubs[i]['name'];
                        var newfriend='<div class=\'friend\'\
                                       id=\'club'+gClubNum+'\'\
                                       onclick=\'onclub(event);\'\
                                       >'+name+'</div>';
                        gClubNum += 1;
                        $('#activityclublist').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateUserinfo() {
    $.get({
        url: 'http://johnwesthoff.com:3111/myclubs/'+gSelFriend,
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                gMyClubs = responseData.clubs;
                $('#userinfo').empty();
                if (gMyClubs) {
                    for (var i = 0; i < gMyClubs.length; i += 1) {
                        var name = gMyClubs[i]['club'];
                        var act = gMyClubs[i]['activity'];
                        var newfriend='<div class=\'friend\' '+
                                       'id=\'fclub'+i+'\' '+
                                       'onclick=\'onmyclub('+i+');\'>'+
                                       act+': '+name+'</div>';
                        $('#userinfo').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateMyClubs() {
    $.get({
        url: 'http://johnwesthoff.com:3111/myclubs/'+gUser,
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                gMyClubs = responseData.clubs;
                $('#clublist').empty();
                if (gMyClubs) {
                    for (var i = 0; i < gMyClubs.length; i += 1) {
                        var name = gMyClubs[i]['club'];
                        var act = gMyClubs[i]['activity'];
                        var newfriend='<div class=\'friend\' '+
                                       'id=\'mclub'+i+'\' '+
                                       'onclick=\'onmyclub('+i+');\'>'+
                                       act+': '+name+'</div>';
                        $('#clublist').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateActivitiesM() {
    $.get({
        url: 'http://johnwesthoff.com:3111/activities',
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                var activities = responseData.activities;
                $('#activitylistm').empty();
                if (activities) {
                    for (var i = 0; i < activities.length; i += 1) {
                        var name = activities[i]['name'];
                        var newfriend='<div class=\'friend\'\
                                       id=\'actm'+i+'\'\
                                       onclick=\'onactivitym(event);\'\
                                       >'+name+'</div>';
                        gActNum += 1;
                        $('#activitylistm').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateActivities() {
    $.get({
        url: 'http://johnwesthoff.com:3111/activities',
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                var activities = responseData.activities;
                gActNum = 0;
                $('#activitylist').empty();
                if (activities) {
                    for (var i = 0; i < activities.length; i += 1) {
                        var name = activities[i]['name'];
                        var newfriend='<div class=\'friend\'\
                                       id=\'act'+gActNum+'\'\
                                       onclick=\'onactivity(event);\'\
                                       >'+name+'</div>';
                        gActNum += 1;
                        $('#activitylist').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateChallenges() {
    var formData={
        "user": gUser,
        "token": gToken,
    };
    $.post({
        url: 'http://johnwesthoff.com:3111/challenges',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                $('#clist').empty();
                gChallenges = responseData.challenges;
                gChalNum = 0;
                if (gChallenges) {
                    for (var i = 0; i < gChallenges.length; i += 1) {
                        var name = "";
                        if (gChallenges[i]['foe'] === gUser) {
                            name = gChallenges[i]['user'];
                        } else {
                            name = gChallenges[i]['foe'];
                        }
                        name += ' - ' + gChallenges[i]['activity'];
                        var newfriend='<div class=\'friend\'\
                                       id=\'chal'+gChalNum+'\'\
                                       onclick=\'onChal('+i+');\'\
                                       >'+name+'</div>';
                        gChalNum += 1;
                        $('#clist').append(newfriend);
                    } 
                }
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function populateFriends() {
    var formData={
        "user": gUser,
        "token": gToken,
    };
    $.post({
        url: 'http://johnwesthoff.com:3111/friendlist',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                $('#friendlist').empty();
                var friends = responseData.friends;
                gFriendNum = 0;
                for (var i = 0; i < friends.length; i += 1) {
                var newfriend='<div class=\'friend\'\
                               id=\'friend'+gFriendNum+'\'\
                               onclick=\'onfriend(event);\'\
                               >'+friends[i]['friend']+'</div>';
                gFriendNum += 1;
                $('#friendlist').append(newfriend);
                } 
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
