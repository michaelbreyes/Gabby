var App = App || {};

App.UI = {
    initialize: function ($createRoomDialog, fnCreateRoom) {
        $createRoomDialog.dialog({
            autoOpen: false, modal: true,
            buttons: { "Create": fnCreateRoom, "Cancel": function () { $(this).dialog('close'); } }
        });
        $("#juser").jPlayer({ //user
            ready: function () { $(this).jPlayer("setMedia", { mp3: "" }); },
            swfPath: "/Content/Scripts/libs/jplayer",
            supplied: "mp3",
            wmode: "window",
            volume: "0.75"
        });
        $("#jsystem").jPlayer({ //alert
            ready: function () { $(this).jPlayer("setMedia", { mp3: "/Content/Sounds/notify.mp3" }); },
            swfPath: "/Content/Scripts/libs/jplayer",
            supplied: "mp3",
            wmode: "window"
        });
    },

    clearNewMessage: function ($newMsg) {
        $newMsg.val('');
        $newMsg.focus();
    },

    showCreateRoomDialog: function ($privateRoom, $roomPasswordDiv, $createRoomDialog) {
        $privateRoom.removeAttr('checked');
        $roomPasswordDiv.hide();
        $createRoomDialog.dialog('open');
    },

    hideCreateRoomDialog: function ($createRoomName, $createRoomDialog) {
        $createRoomName.val('');
        $createRoomDialog.dialog('close');
    },

    toggleDiv: function ($div) {
        if ($div.is(':visible')) {
            $div.slideUp();
        } else {
            $div.slideDown();
        }
    },

    toggleUserList: function ($plusMinus, $expandable, $roomNameRow) {
        $plusMinus.children('.plus').toggleClass('icon-plus-line');
        if ($expandable.is(':visible')) {
            $expandable.slideUp();
            $roomNameRow.addClass('user-list-closed');
        } else {
            $expandable.slideDown();
            $roomNameRow.removeClass('user-list-closed');
        }
    },

    changeCurrentRoom: function ($roomName, roomName) {
        $roomName.text(roomName);
    },

    turnOnWatch: function ($watchButton) {
        $watchButton.removeClass('eye-opened');
        $watchButton.addClass('eye-closed');
    },

    turnOffWatch: function ($watchButton) {
        $watchButton.removeClass('eye-closed');
        $watchButton.addClass('eye-opened');
    },

    toggleRoomPasswordDiv: function ($check, $roomPasswordDiv) {
        if ($check.is(':checked')) {
            $roomPasswordDiv.slideDown();
        } else {
            $roomPasswordDiv.slideUp();
        }
    },

    toggleBlackboard: function ($blackboardDiv, $roomDivs) {
        if ($blackboardDiv.is(':visible')) {
            $roomDivs.slideDown();
            $blackboardDiv.slideUp();
        } else {
            $roomDivs.slideUp();
            $blackboardDiv.slideDown();
        }
    },

    setColor: function ($el, $blackboardToolbarColors) {
        $blackboardToolbarColors.removeClass('selected');
        $el.addClass('selected');
    },

    hidePassword: function ($box) {
        $box.addClass('display-none').val('');
    },

    showPassword: function ($box) {
        $box.removeClass('display-none').focus();
    }
};

App.Globals = (function () {
    var $htmlCloser;

    var getDateTime = function (date) {
        var fmtDate = formatDate(date),
            now = formatDate((new Date()).toString()),
            time = formatTime(date),
            result = '';

        if (fmtDate !== now) result = fmtDate + ' ';
        result += time;

        return result;
    };

    var setContextId = function (id) {
        var keyinput = 'context';
        if (typeof (window.localStorage) != 'undefined') {
            window.localStorage.setItem(keyinput, id);
        }
    };

    var getContextId = function () {
        if (typeof (window.localStorage) != 'undefined') {
            return window.localStorage.getItem('context');
        }
        return '';
    };

    var formatDate = function (date) {
        var d = getDate(date);
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear().toString().substr(2, 2);
    };

    var getDate = function (date) {
        if (date.indexOf('Date') > 0) return getDateFromDotNetString(date);
        //if (date.substr(2, 1) == ':') return getDateFromTimeOnly(date);
        return new Date(date);
    };

    var getDateFromDotNetString = function (dateString) {
        var date = new Date(),
            secs = dateString.replace('/Date(', '').replace(')/', ''),
            indx = secs.indexOf('-');

        // Trim offset info if necessary
        if (indx > 0) secs = secs.substr(0, indx);
        // Create native date
        date.setTime(secs);

        return date;
    };

    var formatTime = function (time) {
        var d = getDate(time),
            curHour = d.getHours(),
            curMin = d.getMinutes(),
            amOrPm = curHour < 12 ? 'AM' : 'PM';

        if (curMin < 10) curMin = '0' + curMin;
        if (curHour == 0) curHour = 12;
        else if (curHour > 12) curHour -= 12;

        return curHour + ':' + curMin + ' ' + amOrPm;
    };

    var usernameFromEmail = function (email) {
        var index = email.indexOf('@');
        if (index > 0) return email.substr(0, index);
        return email;
    };

    var buildMessage = function (content, userid, datePosted) {
        var realContent = content;
        if (App.htmlEnabled == "true") {
            realContent = fixHtml(unescape(content));
        }
        var msg = new App.Message();
        msg.create(realContent, userid, usernameFromEmail(userid.toString()), getImageUrl(userid), getDateTime(datePosted), userid == App.currentUserId);

        return msg;
    };

    var getImageUrl = function (email, size) {
        if (email == null) email = "";
        email = email.replace(/^\s+|\s+$/g, '').toLowerCase();
        var hash = calcMD5(email);
        var genecaLogoUrl = "";
        var defaults = [genecaLogoUrl, "identicon", "mm", "wavatar", "monsterid", "retro"];
        var imageSize = size ? size : "45";
        var url = "http://www.gravatar.com/avatar/" + hash + "?d=" + defaults[3] + "&s=" + imageSize;
        return url;
    };

    var isHtmlEnabled = function () {
        return App.htmlEnabled;
    };

    var fixHtml = function (html) {
        $htmlCloser = $htmlCloser || $('<div/>');
        return $htmlCloser.html(html).html();
    };

    return {
        setContextId: function (id) {
            return setContextId(id);
        },
        getContextId: function () {
            return getContextId();
        },
        buildMessage: function (content, userid, datePosted) {
            return buildMessage(content, userid, datePosted);
        },
        getImageUrl: function (email, size) {
            return getImageUrl(email, size);
        },
        isHtmlEnabled: function () {
            return isHtmlEnabled();
        },
        fixHtml: function (html) {
            return fixHtml(html);
        }
    };
})();

App.Sounds = (function () {
    var mutedUsers = false,
        mutedSystem = false,
        jp = $("#juser"), //users
        jps = $("#jsystem"); //system

    var pausePlay = function () {
        if (jp.data("jPlayer").status.paused) {
            jp.jPlayer("play");
        } else {
            jp.jPlayer("pause");
        }
    };

    var playSchwing = function () {
        playUsers("/Content/Sounds/schwing.mp3");
    };

    var playCromagnum = function () {
        playUsers("http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3");
    };

    var playUsers = function (url) {
        jp.jPlayer("stop");
        if (!mutedUsers) {
            jp.jPlayer("setMedia", { mp3: url });
            jp.jPlayer("play");
        }
    };

    var stop = function () {
        jp.jPlayer("stop");
        jps.jPlayer("stop");
    };
    var muteUsers = function () {
        mutedUsers = !mutedUsers;
        if (mutedUsers) jp.jPlayer("pause");
        else jp.jPlayer("play");
    };
    var muteSystem = function () {
        mutedSystem = !mutedSystem;
        if (mutedSystem) jps.jPlayer("stop");
    };

    var alert = function () {
        if (!mutedSystem) {
            jps.jPlayer("play");
        }
    };

    var executeCommand = function (command, url) {
        switch (command) {
            case "stop":
                stop();
                break;
            case "pause":
                pausePlay();
                break;
            case "mute":
                muteUsers();
                App.Sounds.MuteSystem();
                break;
            case "muteSystem":
                muteSystem();
                break;
            case "alert":
                alert();
                break;
            case "play":
                if (url !== null && url.length > 1) playUsers(url);
                break;
            default:
                //execute nothing
        }
    };

    return {
        PlayCromagnum: function () {
            playCromagnum();
        },
        PlaySchwing: function () {
            playSchwing();
        },
        ExecuteCommand: function (command, url) {
            executeCommand(command, url);
        },
        Stop: function () {
            stop();
        },
        Pause: function () {
            pausePlay();
        },
        Mute: function () {
            muteUsers();
        },
        MuteSystem: function () {
            muteSystem();
        },
        Alert: function () {
            alert();
        },
        Play: function (url) {
            playUsers(url);
        }
    };

})();

App.SignalR = (function () {
    var connection = null,
        currentUser = null,
        funcs = null;

    var initialize = function (params) {
        bindVariables(params);
        establishConnectionToHub();
    };

    var bindVariables = function (params) {
        currentUser = params.userId;
        funcs = params.funcs;
    };

    var establishConnectionToHub = function () {
        connection = $.connection.sitehub;
        mapServerFunctionsToClientFunctions();

        $.connection.hub.start({ transport: 'auto' }, function () {
            funcs.hubConnectionEstablished(currentUser);
        });
    };

    var mapServerFunctionsToClientFunctions = function () {
        connection.ReceiveMessage = function (msg, roomName) { funcs.receiveMessage(msg, roomName); };
        connection.DisplayRoomMessages = function (msgs) { funcs.displayRoomMessages(msgs); };
        connection.DisplayAllActiveRooms = function (rooms) { funcs.displayAllActiveRooms(rooms); };
        connection.AddRoom = function (room) { funcs.addRoom(room); };
        connection.ResetRoomCount = function (roomName) { funcs.resetRoomCount(roomName); };
        connection.SetContextId = function (id) { funcs.setContextId(id); };
        connection.UserJoinedRoom = function (roomName, userToAdd) { funcs.addUser(roomName, userToAdd); };
        connection.UserLeftRoom = function (roomName, userToRemove) { funcs.removeUser(roomName, userToRemove); };
        connection.DisplayUsers = function (users) { funcs.displayUsers(users); };
        connection.LogoutClick = function () { funcs.logout(); };
        connection.PartnerDrawStart = function (userName, color, thickness, x, y) { funcs.drawStart(userName, color, thickness, x, y); };
        connection.PartnerDrawMove = function (userName, x, y) { funcs.drawMove(userName, x, y); };
        connection.PartnerDrawEnd = function (userName) { funcs.drawEnd(userName); };
        connection.PartnerDrawClear = function (userName) { funcs.drawClear(userName); };
    };

    var login = function (username, callback) {
        username = username || currentUser;
        connection.login(username).done(function (isLoggedIn) {
            if (isLoggedIn) {
                callback();
            }
            else {
                alert('There was an issue logging in.');
            }
        });
    };

    var sendMessage = function (roomName, msg) {
        var content = (App.htmlEnabled == "true") ? escape(disableScriptTags(msg)) : msg;
        connection.relayMessage(currentUser, roomName, buildServerSideMessage(content, currentUser));
    };

    var disableScriptTags = function (html) {
        var regex = new RegExp('<script', 'gi');
        return html.replace(regex, "<scrpt");
    };

    var buildServerSideMessage = function (content, userId) {
        return { Content: content, UserId: userId };
    };

    var displayGabbyRoomModels = function (callback) {
        connection.getAllActiveGabbyRoomModels().done(function (gabbyRoomModel) {
            callback(gabbyRoomModel);
        });
    };

    var checkRoomPassword = function (roomName, password, callback) {
        connection.checkPassword(roomName, currentUser, password)
            .done(function (result) {
                if (result) {
                    callback(roomName);
                } else {
                    alert("wrong password");
                }
            })
            .fail(function () {
                alert("couldn't connect");
            });
    };

    return {
        initialize: function (params) {
            initialize(params);
        },
        sendMessage: function (roomName, msg) {
            sendMessage(roomName, msg);
        },
        enterRoom: function (roomName) {
            connection.enterRoom(roomName, currentUser);
        },
        addRoom: function (roomName, password) {
            connection.addRoom(roomName, password);
        },
        disconnect: function () {
            connection.disconnect();
        },
        displayUsers: function () {
            connection.displayUserList();
        },
        remove: function (contextId, callback, loginUsername) {
            connection.remove(contextId).done(function () {
                callback(loginUsername);
            });
        },
        watchRoom: function (roomName) {
            connection.watchRoom(roomName, currentUser);
        },
        login: function (username, callback) {
            login(username, callback);
        },
        refreshAndLogin: function (context) {
            connection.refreshAndLogin(context);
        },
        displayGabbyRoomModels: function (callback) {
            displayGabbyRoomModels(callback);
        },
        updateCanvas: function (canvas) {
            connection.updateCanvas(canvas);
        },
        drawStart: function (color, thickness, x, y) {
            connection.drawStart(currentUser, color, thickness, x, y);
        },
        drawMove: function (x, y) {
            connection.drawMove(currentUser, x, y);
        },
        drawEnd: function () {
            connection.drawEnd(currentUser);
        },
        drawClear: function () {
            connection.drawClear(currentUser);
        },
        checkRoomPassword: function (roomName, password, callback) {
            checkRoomPassword(roomName, password, callback);
        }
    };
})();

App.Draw = (function () {
    var canvasId,
        $canvasContainer,
        canvas,
        canvasContext,
        tool,
        activeColor,
        activeThickness,
        funcs,
        users,
        userPens,
        userId;

    var initialize = function (params) {
        bindVariables(params);
        canvas = document.getElementById(canvasId);
        canvas.onselectstart = function () { return false; }; // ie
        canvas.onmousedown = function () { return false; }; // mozilla
        canvasContext = canvas.getContext('2d');
        canvasContext.lineCap = 'round';
        setColor('#fff');
        setThickness(3);

        tool = new drawTool();

        canvas.addEventListener('mousedown', draw, false);
        canvas.addEventListener('mousemove', draw, false);
        canvas.addEventListener('mouseup', draw, false);
    };

    var bindVariables = function (params) {
        canvasId = params.canvasId;
        $canvasContainer = params.$canvasContainer;
        userId = params.userId;
        funcs = params.funcs;
        users = [];
        userPens = [];
    };

    var drawTool = function () {
        var self = this;
        self.started = false;

        self.mousedown = function (evt) {
            canvasContext.beginPath();
            canvasContext.moveTo(evt.layerX, evt.layerY);
            self.started = true;
            funcs.drawStart(activeColor, activeThickness, evt.layerX, evt.layerY);
        };

        self.mousemove = function (evt) {
            if (self.started) {
                canvasContext.lineTo(evt.layerX, evt.layerY);
                canvasContext.stroke();
                funcs.drawMove(evt.layerX, evt.layerY);
            }
        };

        self.mouseup = function () {
            if (self.started) {
                self.started = false;
                funcs.drawEnd();
            }
        };
    };

    var draw = function (evt) {
        if (!evt.layerX && evt.layerX != 0) return;

        // Invoke the drawing event
        tool[evt.type](evt);
    };

    var clear = function () {
        canvas.width = canvas.width;
        restoreDefaults();
    };

    var blank = function () {
        $('.blackboard').not('#blackboard-canvas').remove();
        $('.name-box').remove();
        users = [];
    };

    var restoreDefaults = function () {
        canvasContext.strokeStyle = activeColor;
        canvasContext.lineWidth = activeThickness;
        canvasContext.lineCap = 'round';
    };

    var setColor = function (color) {
        activeColor = canvasContext.strokeStyle = color;
    };

    var setThickness = function (thickness) {
        activeThickness = canvasContext.lineWidth = thickness;
    };

    var partnerDrawStart = function (username, color, thickness, x, y) {
        if (userId === username) return;
        var userContext = getUserCanvas(username).context,
            userPen = getUserPen(username);
        userPen.color = userContext.strokeStyle = color;
        userPen.thickness = userContext.lineWidth = thickness;
        userContext.beginPath();
        userContext.moveTo(x, y);
    };

    var partnerDrawMove = function (username, x, y) {
        if (userId === username) return;
        var user = getUserCanvas(username),
            userContext = user.context,
            userPen = getUserPen(username);
        userContext.strokeStyle = userPen.color;
        userContext.lineWidth = userPen.thickness;
        userContext.lineTo(x, y);
        userContext.stroke();
        showUsernameBox(user.nameBox, x, y);
    };

    var partnerDrawEnd = function (username) {
        if (userId === username) return;
        var box = getUserCanvas(username).nameBox;
        box.setAttribute('style', 'z-index: -1');
    };

    var partnerDrawClear = function (username) {
        if (userId === username) return;
        var userCanvas = getUserCanvas(username).canvas;
        userCanvas.width = userCanvas.width;
    };

    var getUserPen = function (username) {
        if (userPens[username] == null) userPens[username] = { color: '', thickness: 0 };
        return userPens[username];
    };

    var getUserCanvas = function (username) {
        if (users[username] == null) users[username] = createCanvas(username);
        return users[username];
    };

    var createCanvas = function (username) {
        var el = document.createElement('canvas');
        el.setAttribute('width', '389');
        el.setAttribute('height', '530');
        el.setAttribute('class', 'blackboard');
        $canvasContainer.append(el);

        var nameBox = document.createElement('div');
        nameBox.setAttribute('class', 'name-box');
        nameBox.innerText = username;
        $canvasContainer.append(nameBox);

        return { canvas: el, context: el.getContext('2d'), nameBox: nameBox };
    };

    var showUsernameBox = function (box, mouseX, mouseY) {
        box.setAttribute('style', 'z-index: 2; top: ' + (mouseY + 5) + 'px; left: ' + (mouseX + 5) + 'px');
    };

    return {
        initialize: function (params) {
            initialize(params);
        },
        clear: function () {
            clear();
        },
        blank: function () {
            blank();
        },
        setColor: function (color) {
            setColor(color);
        },
        setThickness: function (thickness) {
            setThickness(thickness);
        },
        partnerDrawStart: function (username, color, thickness, x, y) {
            partnerDrawStart(username, color, thickness, x, y);
        },
        partnerDrawMove: function (username, x, y) {
            partnerDrawMove(username, x, y);
        },
        partnerDrawEnd: function (username) {
            partnerDrawEnd(username);
        },
        partnerDrawClear: function (username) {
            partnerDrawClear(username);
        }
    };
})();