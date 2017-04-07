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
var gUser = '';
var gToken = '';

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
        case 'actpage':
            populateActivities();
        break;
        case 'actclubpage':
            populateClubs();
        break;
        case 'actclubinfopage':
            populateClubInfo();
        break;
        case 'clubpage':
            populateMyClubs();
        break;
    }
}

function onfriend(e) {
    gSelFriend = $("#"+e.target.id).html();
    jump('userinfopage');
}

function onactivity(e) {
    gSelAct = $("#"+e.target.id).html();
    jump('actclubpage');
}

function onclub(e) {
    gSelClub = $("#"+e.target.id).html();
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

function joinClub() {
    var formData={
        "user": gUser,
        "token": gToken,
        "club": gSelClub,
        "activity": gSelAct,
    };
    $.post({
        url: 'http://johnwesthoff.com:3111/joinclub',
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
function issueChallenge() {
    var formData={
        "user": gUser,
        "token": gToken,
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
        url: 'http://johnwesthoff.com:3111/clubs',
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
        url: 'http://johnwesthoff.com:3111/login',
        crossDomain: true,
        data: JSON.stringify(formData),
        contentType: 'application/json',
        processData: false,
        success: function(responseData, textStatus, jqXHR) {
            if (responseData['status']) {
                gToken = responseData['token'];
                console.log(gToken);
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
        "user": $("#reg_user").val(),
        "email": $("#reg_email").val(),
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
            console.log(responseData);
            if (responseData['status']) {
                $("#password").val(formData['pass']);
                $("#user").val(formData['user']);
                login();
            }
        },
        error: function (responseData, textStatus, errorThrown) {
        }
    });
}
