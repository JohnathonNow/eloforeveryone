document.addEventListener("deviceready", onDeviceReady, false);
var gScore = 0;
var gCurPage = '';
var gFriendNum = 0;
var gChalNum = 0;
var gActNum = 0;
var gClubNum = 0;
var gSelFriend = '';
var gSelAct = '';
var gSelClub = '';
var gMyClubs = null;
var gChallenges = null;
var gClubInfo = null;
var gClubs = null;
var gUser = '';
var gFoe = '';
var gToken = '';
var gChalId = '';

function toast(mes) {
    window.plugins.toast.showShortTop(mes, function(a){}, 
                                           function(b){alert(mes)});
}

function onLoad()
{
    jump('startpage');
}

function onPageLoad() {
    switch (gCurPage) {
        case 'userinfopage':
            $('#userheader').html(gSelFriend);            
            populateUserinfo();
        break;
        case 'friendpage':
            populateFriends();
        break;
        case 'mainpage':
            populateChallenges();
        break;
        case 'prematchpage':
            populateActivitiesM();
        break;
        case 'actpage':
            populateActivities();
        break;
        case 'actclubpage':
            populateClubs();
        break;
        case 'actclubinfopage':
            console.log(gSelClub);
            populateClubInfo();
        break;
        case 'clubpage':
            populateMyClubs();
        break;
    }
}

function onfriendclub(i) {
    gSelFriend = gClubInfo[i].user;
    jump('userinfopage');
}

function onfriend(e) {
    gSelFriend = $("#"+e.target.id).html();
    jump('userinfopage');
}

function onChal(i) {
    gSelAct = gChallenges[i].activity;
    gChalId = gChallenges[i]._id;
    if (gUser === gChallenges[i].user) {
        gFoe = gChallenges[i].foe;
        $('#myscore').val(gChallenges[i].user_score);
        $('#theirscore').val(gChallenges[i].foe_score);
    } else {
        gFoe = gChallenges[i].user;
        $('#myscore').val(gChallenges[i].foe_score);
        $('#theirscore').val(gChallenges[i].user_score);
    }
    jump("matchpage");
}
function onactivitym(e) {
    gSelAct = $("#"+e.target.id).html();
    issueChallenge();
}
function onactivity(e) {
    gSelAct = $("#"+e.target.id).html();
    jump('actclubpage');
}

function onclub(i) {
    gSelClub = gClubs[i].name;
    jump('actclubinfopage');
}

function onmyclub(i) {
    var c = gMyClubs[i];
    gSelClub = c.club;
    gSelAct = c.activity;
    jump('actclubinfopage');
}

function addFriend() {
    var formData={
        "user": gUser,
        "token": gToken,
        "friend": $("#af_user").val(),
    };
    $.post({
        url: 'https://johnwesthoff.com/efe/friends',
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

function joinClub() {
    var formData={
        "user": gUser,
        "token": gToken,
        "club": gSelClub,
        "activity": gSelAct,
    };
    $.post({
        url: 'https://johnwesthoff.com/efe/joinclub',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                jump("actclubinfopage");
            } 
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function unfriend() {
    var formData={
        "user": gUser,
        "token": gToken,
        "foe": $("#userheader").html(),
    };
    $.post({
        url: 'https://johnwesthoff.com/efe/unfriend',
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
function sendScore() {
    console.log(gChalId);
    var formData={
        "user": gUser,
        "token": gToken,
        "activity": gSelAct,
        "id": gChalId,
        "foe": gFoe,
        "userscore": $('#myscore').val(),
        "foescore": $('#theirscore').val(),
    };
    $.post({
        url: 'https://johnwesthoff.com/efe/score',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                jump("mainpage");
            } else {
                toast("Resubmit when you both have entered the same scores.");
                jump("matchpage");
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function issueChallenge() {
    gFoe = $("#userheader").html();
    var formData={
        "user": gUser,
        "token": gToken,
        "activity": gSelAct,
        "foe": gFoe,
    };
    $.post({
        url: 'https://johnwesthoff.com/efe/newchallenge',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                gChalId = responseData.id;
                console.log(gChalId);
                $('#myscore').val(0);
                $('#theirscore').val(0);
                jump("matchpage");
            } 
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function createClub() {
    var formData={
        "token": gToken,
        "user": gUser,
        "activity": gSelAct,
        "description": $("#ac_description").val(),
        "name": $("#ac_name").val(),
        "location": $("#ac_location").val(),
    };
    $.post({
        url: 'https://johnwesthoff.com/efe/clubs',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData.status) {
                jump("actclubpage");
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
    gUser = $("#user").val();
    var formData={
        "user": gUser,
        "pass": $("#password").val(),
    };
    $.post({
        type: 'POST',
        url: 'https://johnwesthoff.com/efe/login',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData['status']) {
                gToken = responseData['token'];
                gUser = responseData['user'];
                console.log(gToken);
                toast("Logged In!");
                jump('mainpage');
            } else {
                toast("Loggin Failed!");
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
function register()
{
    if ($("#reg_password1").val() !== $("#reg_password2").val()) {

        toast("You entered two different passwords.");
        return;
    }
    var formData={
        "user": $("#reg_user").val(),
        "email": $("#reg_email").val(),
        "pass": $("#reg_password1").val(),
    };
    $.post({
        type: 'POST',
        url: 'https://johnwesthoff.com/efe/register',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            console.log(responseData);
            if (responseData['status']) {
                $("#password").val(formData['pass']);
                $("#user").val(formData['user']);
                login();
            } else {
                toast("Registration failed - perhaps the name is taken?");
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
