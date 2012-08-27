var Globals = {
    regExp_script_checker: /.*?<script \b[^>]*>.*?<[/]script>|.*?<script .*?[/]>.*?/i,
    regExp_script_open_check:/.*?<script .*?/i
};

Globals.APIController = {
    getRooms: function() {
        if (App.RoomController.content.length == 0) {
            $.post("/JsApi/GetRooms", function(jsonResults) {
                //                for (i = 0, length = jsonResults.length; i < length; i++) {
                //                    App.RoomController.pushObject(jsonResults[i]); //not sure how to reference RoolmsController array.  This is causing a js exception on admin page.
                //                }
                App.RoomController.displayAllActiveRooms(jsonResults);
            });
        }
    },

    parseCommand: function(message) {
        var escaped = App.Globals.isHtmlEnabled;
        var left = '%7B%7B';
        var right = '%7D%7D';
        if(!escaped) {
            left = '{{';
            right = '}}';
        }
        //Only parses the first command
        var command = "";
        var start = message.indexOf(left);
        var end = message.indexOf(right, start);
        if (start != -1 && end > start) {
            command = message.substring(start + left.length, end);
        }
        return command;
    },

    stripMessage: function(message) {
        var escaped = App.Globals.isHtmlEnabled;
        var left = '%7B%7B';
        var right = '%7D%7D';
        if(!escaped) {
            left = '{{';
            right = '}}';
        }
        //strips out all commands. because at the moment i thnk that's cool.
        var strippedMessage = message;
        var start = strippedMessage.indexOf(left);
        var end;
        while (start !== -1) {
            end = strippedMessage.indexOf(right, start);
            if (end > start) {
                strippedMessage = strippedMessage.substring(0, start) + strippedMessage.substring(end + right.length);
            }
            start = strippedMessage.indexOf(left);
        }
        return strippedMessage;
    },

    executeCommand: function(command) {
        switch (command) {
            case "cromagnum":
                App.Sounds.PlayCromagnum();
                break;
            case "schwing":
                App.Sounds.PlaySchwing();
                break;
            case "stop":
                App.Sounds.Stop();
                break;
            default:
                //execute nothing
        }
    },
    
    performRegexValidation: function (regex, stringToValidate) {
        if(regex.test(stringToValidate)) {
            return true;
        }
        else return false;
    }
};
