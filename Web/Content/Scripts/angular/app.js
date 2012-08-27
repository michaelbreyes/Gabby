// *****************************************************
//  Models
// *****************************************************
App.Room = function () {
    this.Name = '';
    this.count = 0;
    this.countChanged = false;
    this.users = [];
    this.isWatched = false;
    this.isInRoom = false;
    this.isPrivate = false;
    this.isCollapsed = true;

    this.create = function (roomName, missMsgCount, usersArr, password) {
        if (usersArr == null) this.users = [];
        else {
            for (var i in usersArr) {
                this.users.push(usersArr[i]);
            }
        }

        this.Name = roomName;
        this.count = missMsgCount;
        if (password == "" || password == null) {
            this.isPrivate = false;
        } else {
            this.isPrivate = true;
        }
    };
};
App.Message = function () {
    this.Content = '';
    this.UserId = '';
    this.GravatarLink = '';
    this.DatePosted = '';
    this.UserName = '';
    this.MessageFromSelf = false;

    this.datePostedFull = function () {
        return this.DatePosted + ' ' + this.UserName;
    };

    this.create = function (content, userid, username, gravatarLink, datePosted, messageFromSelf) {
        this.Content = content;
        this.UserId = userid;
        this.UserName = username;
        this.GravatarLink = gravatarLink;
        this.DatePosted = datePosted;
        this.MessageFromSelf = messageFromSelf;
    };
};

// *****************************************************
//  Angular Controller
// *****************************************************
function AngularCtrl($scope) {
    //#region Properties
    $scope.rooms = [];
    $scope.messages = [];
    $scope.currentUserId = window.currentUserId;
    $scope.currentRoom = '';
    $scope.avatarUrl = App.Globals.getImageUrl(self.currentUserId, 65);
    App.angularObj = $scope;
    //#endregion

    //#region Methods
    $scope.receiveMessage = function (message, roomName) {
        $scope.$apply(function() {
            var command = Globals.APIController.parseCommand(message.Content);
            message.Content = Globals.APIController.stripMessage(message.Content);
            var parsedMessage = $scope._modelFromChatMessage(message);

            if (App.currentRoom == roomName) {
                $scope.messages.unshift(parsedMessage);
                if (message.UserId != App.currentUserId) App.Sounds.Alert();
                Globals.APIController.executeCommand(command); //Only execute silliness if you're in the same room
            } else {
                $scope.increaseRoomCount(roomName);
            }
        });
    };
    $scope.displayAllMessages = function (messages) {
        $scope.$apply(function() {
            $.each(messages, function() {
                $scope.messages.push($scope._modelFromChatMessage(this));
            });
        });
    };
    $scope.displayAllActiveRooms = function (rooms) {
        for (var i in rooms) {
            $scope.addRoom(rooms[i]);
        }
    };
    $scope.getRoomByName = function (name) {
        var rooms = $scope.rooms;

        for (var i in rooms) {
            if (rooms[i].Name == name) return rooms[i];
        }

        return null;
    };
    $scope.addRoom = function (room) {
        $scope.$apply(function() {
            var roomModel = new App.Room();
            roomModel.create(room.Name, 0, [], room.Password);
            $scope.rooms.push(roomModel);
        });
    };
    $scope.increaseRoomCount = function (roomName) {
        $scope.$apply(function() {
            var room = $scope.getRoomByName(roomName);
            room.count++;
            room.countChanged = true;
        });
    };
    $scope.resetRoomCount = function (roomName) {
        $scope.$apply(function() {
            var room = $scope.getRoomByName(roomName);
            room.count = 0;
            room.countChanged = false;
        });
    };
    $scope.setIsWatched = function (isWatched, roomName) {
        $scope.$apply(function() {
            $scope.getRoomByName(roomName).isWatched = isWatched;
        });
    };
    $scope.setIsInRoom = function (isInRoom, roomName) {
        $scope.$apply(function() {
            $scope.getRoomByName(roomName).isInRoom = isInRoom;
        });
    };
    $scope.setIsCollapsed = function (isCollapsed, roomName) {
        $scope.$apply(function() {
            $scope.getRoomByName(roomName).isCollapsed = isCollapsed;
        });
    };
    $scope.addUser = function (roomName, userToAdd) {
        $scope.$apply(function() {
            var targetRoom = $scope.getRoomByName(roomName);
            if (targetRoom == null) return;

            targetRoom.users.push(userToAdd);
        });
    };
    $scope.removeUser = function (roomName, userToRemove) {
        $scope.$apply(function() {
            var targetRoom = $scope.getRoomByName(roomName);
            if (targetRoom == null) return;

            var index = targetRoom.users.indexOf(userToRemove);
            if (index >= 0) targetRoom.users.splice(index, 1);
        });
    };
    $scope.displayUsers = function (userList) {
        $scope.$apply(function() {
            var targetRoom;
            $.each(userList, function() {
                if (this.Name != App.currentUserId) {
                    targetRoom = $scope.getRoomByName(this.RoomIn);
                    if (targetRoom != null) {
                        targetRoom.users.push(this.Name);
                    }
                }
            });
        });
    };
    $scope._modelFromChatMessage = function (message) {
        message.Content = Globals.APIController.stripMessage(message.Content);
        return App.Globals.buildMessage(message.Content, message.UserId, message.DatePosted);
    };
    $scope.isRoomWatched = function (room) {
        return room.isWatched;
    };
    $scope.isRoomNotWatched = function (room) {
        return !room.isWatched;
    };
    //#endregion
}

// *****************************************************
//  Document Ready Event
// *****************************************************
$(function () {
    var app = window.App,
        viewModel = app.angularObj;

    // Items needed by mediator
    app.MessageController = app.RoomController = viewModel;
    app.currentUserId = viewModel.currentUserId;
    app.currentRoom = viewModel.currentRoom;
    app.htmlEnabled = window.htmlEnabled;

    app.Mediator.initialize();
});

