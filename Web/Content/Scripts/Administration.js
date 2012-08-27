var AdministrationHelper = (function () {
    var getRooms = function () {
        Globals.APIController.getRooms();
    };

    var bindEvents = function () {
        $(".deleteLink").live('click', deleteRoom);
        $('#program-title').on('click', goHome);
    };

    var goHome = function () {
        window.location.href = "/";
    };

    var deleteRoom = function (evt) {
        evt.preventDefault();
        var roomname = $(this).attr('data-roomname').toString();
        $.post("/Administration/DeleteRoom", { roomname: roomname }, function () {
            App.RoomController.removeRoom(roomname);
        });
    };

    return {
        GetRooms: function () { getRooms(); },
        BindEvents: function () { bindEvents(); }
    };

})();

