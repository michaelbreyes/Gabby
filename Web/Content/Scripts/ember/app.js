// *****************************************************
//  Application
// *****************************************************
var App = Ember.Application.create({
    currentUserId: '',
    currentRoom: '',
    htmlEnabled: false,

    avatarUrl: (function () {
        return App.Globals.getImageUrl(this.currentUserId, 65);
    }).property('currentUserId')
});

// *****************************************************
//  Models
// *****************************************************
App.Room = Ember.Object.extend({
    Name: '',
    count: 0,
    countChanged: false,
    users: [],
    isWatched: false,
    isInRoom: false,
    isPrivate: false,
    isCollapsed: true,
    create: function (roomName, missMsgCount, usersArr, password) {
        if (usersArr == null) this.users = [];
        else this.users = usersArr;

        this.Name = roomName;
        this.count = missMsgCount;
        if (password == "" || password == null) {
            this.isPrivate = false;
        }
        else {
            this.isPrivate = true;
        }
    }
});
App.Message = Ember.Object.extend({
    Content: '',
    UserId: '',
    GravatarLink: '',
    create: function (content, userid, username, gravatarLink, datePosted, messageFromSelf) {
        this.set('Content', content);
        this.set('UserId', userid);
        this.set('UserName', username);
        this.set('GravatarLink', gravatarLink);
        this.set('DatePosted', datePosted);
        this.set('MessageFromSelf', messageFromSelf);
    }
});

// *****************************************************
//  Controllers
// *****************************************************
// *****************************************************
//  * MessageController *
//  Responsible for handling sending and receiving messages 
// *****************************************************
App.MessageController = Ember.ArrayController.create({
    content: [],

    receiveMessage: function (message, roomName) {
        var command = Globals.APIController.parseCommand(message.Content);
        message.Content = Globals.APIController.stripMessage(message.Content);
        var parsedMessage = this.modelFromChatMessage(message);

        if (App.currentRoom.toString() == roomName) {
            this.unshiftObject(parsedMessage);
            if (message.UserId != App.currentUserId) App.Sounds.Alert();
            Globals.APIController.executeCommand(command); //Only execute silliness if you're in the same room
        } else {
            App.RoomController.increaseRoomCount(roomName);
        }
    },

    displayAllMessages: function (messages) {
        var self = this,
            arr = [];

        $.each(messages, function () {
            arr[arr.length] = self.modelFromChatMessage(this);
        });

        self.set('content', arr);
    },

    modelFromChatMessage: function (message) {
        message.Content = Globals.APIController.stripMessage(message.Content);
        return App.Globals.buildMessage(message.Content, message.UserId, message.DatePosted);
    }
});
// *****************************************************
//  * RoomsController *
//  Responsible for handling the list of rooms displayed on the left side of the screen
// *****************************************************
App.RoomController = Ember.ArrayController.create({
    content: [],

    getRoomByName: function (roomName) {
        return this.filterProperty('Name', roomName)[0];
    },

    increaseRoomCount: function (roomName) {
        var room = this.getRoomByName(roomName);
        room.set('count', room.get('count') + 1);
        room.set('countChanged', true);
    },

    resetRoomCount: function (roomName) {
        var room = this.getRoomByName(roomName);
        room.set('count', 0);
        room.set('countChanged', false);
    },

    setIsWatched: function (isWatched, roomName) {
        this.getRoomByName(roomName).set('isWatched', isWatched);
    },

    setIsInRoom: function (isInRoom, roomName) {
        this.getRoomByName(roomName).set('isInRoom', isInRoom);
    },

    setIsCollapsed: function (isCollapsed, roomName) {
        this.getRoomByName(roomName).set('isCollapsed', isCollapsed);
    },

    displayUsers: function (userList) {
        var self = this,
            targetRoom;
        $.each(userList, function () {
            if (this.Name != App.currentUserId) {
                targetRoom = self.getRoomByName(this.RoomIn);
                if (targetRoom != null) {
                    targetRoom.users.pushObject(this.Name);
                }
            }
        });
    },

    addUser: function (roomName, userToAdd) {
        var targetRoom = this.getRoomByName(roomName);
        if (targetRoom == null) return;

        targetRoom.users.pushObject(userToAdd);
    },

    removeUser: function (roomName, userToRemove) {
        var targetRoom = this.getRoomByName(roomName);
        if (targetRoom == null) return;

        targetRoom.users.removeObject(userToRemove);
    },

    removeRoom: function (roomName) {
        var targetRoom = this.getRoomByName(roomName);
        this.removeObject(targetRoom);
    },

    addRoom: function (room) {
        var roomModel = new App.Room();
        roomModel.create(room.Name, 0, [], room.Password);
        this.content.pushObject(roomModel);
    },

    displayAllActiveRooms: function (rooms) {
        var self = this;
        $.each(rooms, function () {
            self.addRoom(this);
        });
    }
});

// *****************************************************
//  Document Ready Event
// *****************************************************
$(function () {
    // Items needed by mediator
    App.set('currentUserId', window.currentUserId);
    App.set('htmlEnabled', window.htmlEnabled);

    App.Mediator.initialize();
});
