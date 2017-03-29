
document.addEventListener("deviceready", onDeviceReady, false);
var gScore = 0;
var gCurPage = '';
var gFriendNum = 0;

var gSelFriend = '';

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
    }
}

function onfriend(e) {
    gSelFriend = e.target.id;
    jump('userinfopage');
}

function populateFriends() {
    $('#friendlist').empty();
    gFriendNum = 0;
    for (var i = 0; i < 10; i += 1) {
    var newfriend='<div class=\'friend\'\
                   id=\'friend'+gFriendNum+'\'\
                   onclick=\'onfriend(event);\'\
                   >FRIEND '+(gFriendNum+1)+'</div>';
    gFriendNum += 1;
    $('#friendlist').append(newfriend);
    } 
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

function send()
{
    $.ajax({
            type: 'POST',
            url: 'https://johnbot.me/t.php',
            crossDomain: true,
            data: '{"some":"json"}',
            dataType: 'json',
            success: function(responseData, textStatus, jqXHR) {
                        alert(responseData);
                    },
            error: function (responseData, textStatus, errorThrown) {
                        alert('POST failed: ' + errorThrown);
                    }
    });
}
function score(a)
{
    gScore = gScore + a;
    $( "#score" ).html("Score: " + gScore);
}
