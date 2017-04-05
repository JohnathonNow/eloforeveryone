function populateClubs() {
    $.get({
        url: 'http://johnwesthoff.com:3111/clubs/'+$("#"+gSelAct).html(),
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            console.log(responseData);
            if (responseData.status) {
                var clubs = responseData.clubs;
                console.log(clubs);
                gClubNum = 0;
                $('#activityclublist').empty();
                if (clubs) {
                    for (var i = 0; i < clubs.length; i += 1) {
                        var name = clubs[i]['name'];
                        var newfriend='<div class=\'friend\'\
                                       id=\'act'+gClubNum+'\'\
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
function populateActivities() {
    $.get({
        url: 'http://johnwesthoff.com:3111/activities',
        crossDomain: true,
        success: function(responseData, textStatus, jqXHR) {
            console.log(responseData);
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
    };
    $.post({
        url: 'http://johnwesthoff.com:3111/challenges',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            console.log(responseData);
            if (responseData.status) {
                $('#clist').empty();
                var challenges = responseData.challenges;
                gChalNum = 0;
                if (challenges) {
                    for (var i = 0; i < challenges.length; i += 1) {
                        var name = "";
                        if (challenges[i]['foe'] === gUser) {
                            name = challenges[i]['user'];
                        } else {
                            name = challenges[i]['foe'];
                        }
                        var newfriend='<div class=\'friend\'\
                                       id=\'chal'+gChalNum+'\'\
                                       onclick=\'onfriend(event);\'\
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
                console.log(friends);
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
