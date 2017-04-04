document.addEventListener("deviceready", onDeviceReady, false);
var gScore = 0;
var gCurPage = '';
var gFriendNum = 0;
var gChalNum = 0;
var gSelFriend = '';
var gUser = '';

function onLoad()
{
    jump('startpage');
}

function onPageLoad() {
    switch (gCurPage) {
        case 'userinfopage':
            $('#userheader').html($('#'+gSelFriend).html());            
        break;
        case 'friendpage':
            populateFriends();
        break;
        case 'mainpage':
            populateChallenges();
        break;
    }
}

function onfriend(e) {
    gSelFriend = e.target.id;
    jump('userinfopage');
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

function addFriend() {
    var formData={
        "user": gUser,
        "friend": $("#af_email").val(),
    };
    $.post({
        url: 'http://johnwesthoff.com:3111/friends',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                jump("friendpage");
            } 
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}

function issueChallenge() {
    var formData={
        "user": gUser,
        "foe": $("#userheader").html(),
    };
    $.post({
        url: 'http://johnwesthoff.com:3111/newchallenge',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                jump("matchpage");
            } 
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}

function onDeviceReady()
{
}

function jumpi(newpage)
{
    if (gCurPage != 'startpage' && gCurPage != 'registerpage')
        jump(newpage);
}
function jump(newpage)
{
    gCurPage = newpage;
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++)
    {
        pages[i].style.display = 'none';
    }
    document.getElementById(newpage).style.display = 'block';
    if (newpage == 'startpage' || newpage == 'registerpage')
        $('#bottom').children().addClass('bsd')
    else $('#bottom').children().removeClass('bsd');

    onPageLoad();
}

function login()
{
    gUser = $("#email").val();
    var formData={
        "user": gUser,
        "pass": $("#password").val(),
    };
    $.post({
        type: 'POST',
        url: 'http://johnwesthoff.com:3111/login',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData['status']) {
                jump('mainpage');
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function register()
{
    if ($("#reg_password1").val() !== $("#reg_password2").val()) {
        console.log("DIFFERENT");
        return;
    }
    var formData={
        "user": $("#reg_email").val(),
        "pass": $("#reg_password1").val(),
    };
    $.post({
        type: 'POST',
        url: 'http://johnwesthoff.com:3111/register',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData['status']) {
                $("#password").val(formData['pass']);
                $("#email").val(formData['user']);
                login();
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function score(a)
{
    gScore = gScore + a;
    $( "#score" ).html("Score: " + gScore);
}
