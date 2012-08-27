
App.Mediator = (function () {
    //#region Variables
    var $adminButton,
        $allBlackboards,
        $blackboardButton,
        $blackboardDiv,
        $blackboardToolbarColors,
        $canvasBlank,
        $canvasClear,
        $canvasThickness,
        $createRoomButton,
        $createRoomDialog,
        $createRoomName,
        $expandUsers,
        $inputPassword,
        $logoutButton,
        $newMsg,
        $privateRoom,
        $roomDivs,
        $roomLinks,
        $roomName,
        $roomPassword,
        $roomPasswordDiv,
        $sendMsg,
        $watchRoom,
        passwordPromptRoomName,
        passwordPromptCallback,
        $passwordPromptWatchButton;
    //#endregion

    var bindVariables = function () {
        $adminButton = $('#admin-button');
        $allBlackboards = $('.blackboard');
        $blackboardButton = $('#blackboard-button');
        $blackboardDiv = $('#blackboard-div');
        $blackboardToolbarColors = $('.canvas-color');
        $canvasBlank = $('#canvas-blank');
        $canvasClear = $('#canvas-clear');
        $canvasThickness = $('#canvas-thickness');
        $createRoomButton = $('#create-room-button');
        $createRoomDialog = $('#create-room');
        $createRoomName = $('#create-room-name');
        $expandUsers = $('.expand-users');
        $inputPassword = $('.password-input');
        $logoutButton = $('#logout-button');
        $newMsg = $('#new-message');
        $privateRoom = $('#private-room');
        $roomDivs = $('#watch-rooms-div,#rooms-div');
        $roomLinks = $('.room-link');
        $roomName = $('#room-name');
        $roomPassword = $('#room-password');
        $roomPasswordDiv = $('#room-password-div');
        $sendMsg = $('#send-message');
        $watchRoom = $('.watch-room');
    };

    var bindEvents = function () {
        $('a,input[type=button],button').bind('click', function (evt) { evt.preventDefault(); });
        $sendMsg.on('click', sendMsgClick);
        $newMsg.on('keypress', shiftEnterPress);
        $roomLinks.live('click', enterRoom);
        $logoutButton.on('click', logout);
        $(window).bind('beforeunload', beforeUnload);
        $('#program-title').on('click', function () { window.location.href = "/"; });
        $createRoomButton.bind('click', showCreateRoomDialog);
        $('div.clickable').bind('click', toggleDiv);
        $expandUsers.live('click', toggleUserList);
        $watchRoom.live('click', toggleWatch);
        $privateRoom.bind('click', toggleRoomPasswordDiv);
        $inputPassword.live('keypress', inputPasswordKeyPress);
        $inputPassword.live('blur', passwordBlur);
        $adminButton.bind('click', function () { window.location = $adminButton.attr('data-link'); });
        $blackboardButton.bind('click', toggleBlackboard);
        $canvasClear.bind('click', function () { blackboardToolbarClick('clear'); });
        $canvasBlank.bind('click', function () { blackboardToolbarClick('blank'); });
        $blackboardToolbarColors.bind('click', setBlackboardPenColor);
        $canvasThickness.bind('change', setCanvasThickness);
    };

    var initializeClasses = function () {
        App.UI.initialize($createRoomDialog, createRoomClick);
        App.Draw.initialize(buildParametersForDraw());
        App.SignalR.initialize(buildParametersForSignalR());
    };

    var buildParametersForDraw = function () {
        var signalR = App.SignalR,
            params = {
                canvasId: 'blackboard-canvas',
                $canvasContainer: $('#canvas-container'),
                userId: App.currentUserId,
                funcs: {
                    drawStart: function () { mapFunc(signalR, 'drawStart', arguments); },
                    drawMove: function () { mapFunc(signalR, 'drawMove', arguments); },
                    drawEnd: function () { mapFunc(signalR, 'drawEnd', arguments); }
                }
            };

        return params;
    };

    var buildParametersForSignalR = function () {
        var self = this,
            msgCtrl = App.MessageController,
            roomCtrl = App.RoomController,
            globals = App.Globals,
            drawCtrl = App.Draw,
            params = {
                userId: App.currentUserId,
                funcs: {
                    hubConnectionEstablished: hubConnectionEstablished,
                    receiveMessage: function () { mapFunc(msgCtrl, 'receiveMessage', arguments); },
                    displayRoomMessages: function () { mapFunc(msgCtrl, 'displayAllMessages', arguments); },
                    displayAllActiveRooms: function () { mapFunc(roomCtrl, 'displayAllActiveRooms', arguments); },
                    addRoom: function () { mapFunc(roomCtrl, 'addRoom', arguments); },
                    resetRoomCount: function () { mapFunc(roomCtrl, 'resetRoomCount', arguments); },
                    addUser: function () { mapFunc(roomCtrl, 'addUser', arguments); },
                    removeUser: function () { mapFunc(roomCtrl, 'removeUser', arguments); },
                    displayUsers: function () { mapFunc(roomCtrl, 'displayUsers', arguments); },
                    drawStart: function () { mapFunc(drawCtrl, 'partnerDrawStart', arguments); },
                    drawMove: function () { mapFunc(drawCtrl, 'partnerDrawMove', arguments); },
                    drawEnd: function () { mapFunc(drawCtrl, 'partnerDrawEnd', arguments); },
                    drawClear: function () { mapFunc(drawCtrl, 'partnerDrawClear', arguments); },
                    setContextId: function () { mapFunc(globals, 'setContextId', arguments); },
                    logout: function () { mapFunc(self, 'logout', arguments); }
                }
            };

        return params;
    };

    var mapFunc = function (context, methodName, args) {
        context[methodName].apply(context, args);
    };

    var sendMsgClick = function () {
        var val = $newMsg.val();
        if (val == '') return;

        if (isCommand(val)) {
            executeCommand(val);
        } else {
            App.SignalR.sendMessage(App.currentRoom, val);
        }

        App.UI.clearNewMessage($newMsg);
    };

    var isCommand = function (messageString) {
        return (messageString[0] == "/");
    };

    var executeCommand = function (messageString) {
        var commandArray = messageString.substring(1).split(' '),
            command = commandArray[0],
            url = (command.length > 1) ? commandArray[1] : null;

        App.Sounds.ExecuteCommand(command, url);
    };

    var shiftEnterPress = function (evt) {
        if (evt.which == 13 && !evt.shiftKey) {
            sendMsgClick(evt);
            evt.preventDefault();
        }
    };

    var enterRoom = function (roomNm, pass) {
        var roomName = typeof (roomNm) === 'string' ? roomNm : $(this).text(),
            $password = pass || $(this).siblings('.password-input'),
            room = App.RoomController.getRoomByName(roomName);

        if (!room) return;
        if (!room.isWatched && room.isPrivate && $password.length > 0) {
            setupPasswordPrompt(roomName, null, enterAccepted);
            App.UI.showPassword($password);
            return;
        }

        enterAccepted(roomName);
    };

    var enterAccepted = function (roomName) {
        if (App.currentRoom !== '' && App.currentRoom != roomName) {
            App.RoomController.setIsInRoom(false, App.currentRoom);
        }

        App.currentRoom = roomName;
        App.SignalR.enterRoom(roomName);
        App.UI.changeCurrentRoom($roomName, roomName);
        App.RoomController.setIsInRoom(true, roomName);
        App.RoomController.setIsWatched(true, roomName);
        App.RoomController.setIsCollapsed(false, roomName);
    };

    var logout = function () {
        App.Globals.setContextId('');
        App.SignalR.disconnect();
        window.location.href = "Home/Login";
    };

    var beforeUnload = function () {
        App.SignalR.disconnect();
    };

    var showCreateRoomDialog = function () {
        App.UI.showCreateRoomDialog($privateRoom, $roomPasswordDiv, $createRoomDialog);
    };

    var toggleDiv = function () {
        App.UI.toggleDiv($(this).next('.expandable'));
    };

    var createRoomClick = function () {
        var roomName = $createRoomName.val(),
            roomPassword = $roomPassword.is(':visible') ? $roomPassword.val() : '';

        App.SignalR.addRoom(roomName, roomPassword);
        App.UI.hideCreateRoomDialog($createRoomName, $createRoomDialog);
    };

    var toggleUserList = function () {
        var $el = $(this),
            $roomRow = $el.parent(),
            $expandable = $roomRow.siblings('.expandable'),
            roomName = $roomRow.children('.room-link').text(),
            isCollapsed = $expandable.is(':visible');

        App.UI.toggleUserList($el, $expandable, $roomRow);
        App.RoomController.setIsCollapsed(isCollapsed, roomName);
    };

    var toggleWatch = function () {
        var $watchButton = $(this),
            $password = $watchButton.siblings('.password-input'),
            isWatched = $watchButton.is('.eye-opened'),
            roomName = $watchButton.attr('data-roomname');

        if (isWatched) {
            var room = App.RoomController.getRoomByName(roomName);
            if (room.isPrivate) {
                setupPasswordPrompt(roomName, $watchButton, watchAccepted);
                App.UI.showPassword($password);
                return;
            }
        } else {
            App.UI.turnOffWatch($watchButton);
        }

        watchAccepted(roomName, $watchButton, isWatched);
    };

    var watchAccepted = function (roomName, $watchButton, isWatched) {
        $watchButton = ($watchButton != null) ? $watchButton : $passwordPromptWatchButton;
        isWatched = (isWatched != null) ? isWatched : true;

        App.SignalR.watchRoom(roomName);
        App.UI.turnOnWatch($watchButton);
        App.RoomController.setIsWatched(isWatched, roomName);
    };

    var setupPasswordPrompt = function (roomName, $watchButton, callback) {
        passwordPromptRoomName = roomName;
        $passwordPromptWatchButton = $watchButton;
        passwordPromptCallback = callback;
    };

    var toggleRoomPasswordDiv = function () {
        App.UI.toggleRoomPasswordDiv($privateRoom, $roomPasswordDiv);
    };

    var inputPasswordKeyPress = function (evt) {
        if (evt.which != 13) return;

        App.SignalR.checkRoomPassword(passwordPromptRoomName, $(this).val(), passwordPromptCallback);
        App.UI.hidePassword($(this));
    };

    var passwordBlur = function () {
        App.UI.hidePassword($(this));
    };

    var toggleBlackboard = function () {
        App.UI.toggleBlackboard($blackboardDiv, $roomDivs);
    };

    var blackboardToolbarClick = function (actionName) {
        if (actionName === 'clear' || actionName === 'blank') {
            App.Draw.clear();
            App.SignalR.drawClear();
        }
        if (actionName === 'blank') {
            App.Draw.blank();
        }
    };

    var setBlackboardPenColor = function () {
        var $el = $(this);
        App.Draw.setColor($el.attr('data-color'));
        App.UI.setColor($el, $blackboardToolbarColors);
    };

    var setCanvasThickness = function () {
        App.Draw.setThickness($canvasThickness.val());
    };

    var hubConnectionEstablished = function (username) {
        var context = App.Globals.getContextId();
        App.Globals.setContextId('');

        if (context != '') {
            App.SignalR.remove(context, removeCallback, username);
        } else {
            App.SignalR.login(username, displayGabbyRoomModels);
        }
    };

    var removeCallback = function (loginUsername) {
        App.SignalR.login(loginUsername, displayGabbyRoomModels);
    };

    var displayGabbyRoomModels = function () {
        App.SignalR.displayGabbyRoomModels(displayGabbyRoomModelsCallback);
    };

    var displayGabbyRoomModelsCallback = function (gabbyRoomModel) {
        if (gabbyRoomModel.Rooms.length == 0) return;

        App.RoomController.displayAllActiveRooms(gabbyRoomModel.Rooms);
        App.RoomController.displayUsers(gabbyRoomModel.Users);

        if (App.currentRoom === "") {
            enterRoom('Lounge', []);
        } else {
            enterRoom(App.currentRoom, []);
        }
    };

    return {
        initialize: function () {
            bindVariables();
            bindEvents();
            initializeClasses();
        },
        watchAccepted: function (roomName, $watchButton) {
            watchAccepted(roomName, $watchButton);
        },
        enterAccepted: function (roomName) {
            enterAccepted(roomName);
        },
        enterRoom: function (roomName, $password) {
            enterRoom(roomName, $password);
        },
        logout: function () {
            logout();
        }
    };
})();