// *****************************************************
//  Models
// *****************************************************
App.Room = function () {
    this.Name = '';
    this.count = 0;
    this.countChanged = false;
    this.users = ko.observableArray();
    this.isWatched = ko.observable(false);
    this.isInRoom = ko.observable(false);
    this.isPrivate = ko.observable(false);
    this.isCollapsed = ko.observable(true);

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
    this.Content = ko.observable('');
    this.UserId = ko.observable('');
    this.GravatarLink = ko.observable('');
    this.DatePosted = ko.observable('');
    this.UserName = ko.observable('');
    this.MessageFromSelf = ko.observable(false);

    this.datePostedFull = ko.computed(function () {
        return this.DatePosted() + ' ' + this.UserName();
    }, this);

    this.create = function (content, userid, username, gravatarLink, datePosted, messageFromSelf) {
        this.Content(content);
        this.UserId(userid);
        this.UserName(username);
        this.GravatarLink(gravatarLink);
        this.DatePosted(datePosted);
        this.MessageFromSelf(messageFromSelf);
    };
};
 
// *****************************************************
//  Knockout ViewModel
// *****************************************************
App.ViewModel = function() {
    var self = this;

    //#region Properties
    self.rooms = ko.observableArray([]);
    self.messages = ko.observableArray([]);
    self.currentUserId = ko.observable(window.currentUserId);
    self.currentRoom = ko.observable('');
    self.avatarUrl = ko.observable(App.Globals.getImageUrl(this.currentUserId(), 65));
    //#endregion

    //#region Methods
    self.receiveMessage = function(message, roomName) {
        var command = Globals.APIController.parseCommand(message.Content);
        message.Content = Globals.APIController.stripMessage(message.Content);
        var parsedMessage = self._modelFromChatMessage(message);

        if (App.currentRoom == roomName) {
            self.messages.unshift(parsedMessage);
            if (message.UserId != App.currentUserId) App.Sounds.Alert();
            Globals.APIController.executeCommand(command); //Only execute silliness if you're in the same room
        } else {
            self.increaseRoomCount(roomName);
        }
    };
    self.displayAllMessages = function(messages) {
        self.messages([]);
        $.each(messages, function() {
            self.messages.push(self._modelFromChatMessage(this));
        });
    };
    self.displayAllActiveRooms = function(rooms) {
        for (var i in rooms) {
            self.addRoom(rooms[i]);
        }
    };
    self.getRoomByName = function(name) {
        var rooms = self.rooms();

        for (var i in rooms) {
            if (rooms[i].Name == name) return rooms[i];
        }

        return null;
    };
    self.addRoom = function(room) {
        var roomModel = new App.Room();
        roomModel.create(room.Name, 0, [], room.Password);
        self.rooms.push(roomModel);
    };
    self.increaseRoomCount = function(roomName) {
        var room = self.getRoomByName(roomName);
        room.count++;
        room.countChanged = true;
    };
    self.resetRoomCount = function(roomName) {
        var room = self.getRoomByName(roomName);
        room.count = 0;
        room.countChanged = false;
    };
    self.setIsWatched = function(isWatched, roomName) {
        self.getRoomByName(roomName).isWatched(isWatched);
    };
    self.setIsInRoom = function(isInRoom, roomName) {
        self.getRoomByName(roomName).isInRoom(isInRoom);
    };
    self.setIsCollapsed = function(isCollapsed, roomName) {
        self.getRoomByName(roomName).isCollapsed(isCollapsed);
    };
    self.addUser = function(roomName, userToAdd) {
        var targetRoom = self.getRoomByName(roomName);
        if (targetRoom == null) return;

        targetRoom.users.push(userToAdd);
    };
    self.removeUser = function(roomName, userToRemove) {
        var targetRoom = self.getRoomByName(roomName);
        if (targetRoom == null) return;

        var index = targetRoom.users.indexOf(userToRemove);
        if (index >= 0) targetRoom.users.splice(index, 1);
    };
    self.displayUsers = function(userList) {
        var targetRoom;
        $.each(userList, function() {
            if (this.Name != App.currentUserId) {
                targetRoom = self.getRoomByName(this.RoomIn);
                if (targetRoom != null) {
                    targetRoom.users.push(this.Name);
                }
            }
        });
    };
    self._modelFromChatMessage = function(message) {
        message.Content = Globals.APIController.stripMessage(message.Content);
        return App.Globals.buildMessage(message.Content, message.UserId, message.DatePosted);
    };
    //#endregion
};

// *****************************************************
//  Document Ready Event
// *****************************************************
$(function () {
    var app = window.App,
        viewModel = new App.ViewModel();
    ko.applyBindings(viewModel);

    // Items needed by mediator
    app.MessageController = app.RoomController = viewModel;
    app.currentUserId = viewModel.currentUserId();
    app.currentRoom = viewModel.currentRoom();
    app.htmlEnabled = window.htmlEnabled;

    app.Mediator.initialize();
});
