var interview = require('./interview');
var leave = require('./leave');
var userdb = require('./userdb');
var help = require('./help');
var google = require('./googleApi');

module.exports = function(robot) {

    robot.respond(/help/i, function(res) {
        var emit;
        emit = help.join("\n");
        res.send(emit);
    });

    robot.respond(/Cally/i, function(res) {
        var response = 'Hi ' + res.message.user.name + ', My name is Cally and I am here to ' +
            'remind you when your leave will start and other important dates.';
        res.send(response);
    });


    /**
     * LEAVE FUNCTIONALITY
     */

    var userMap = {};
    var loadData = function(callback) {
        userdb.SlackUser.find(function(err, all) {
            for (var i = 0; i < all.length; i++) {
                userMap[all[i].slackId] = all[i];
            }
            callback();
        });
    };


    robot.respond(/list-all/i, function(res) {
        leave.listAll('G064YFGG1', res.message.user.id, res);
    });

    robot.respond(/show|sml|show-my-leave/i, function(res) {
        leave.showOne(res.message.user.name, res.message.user.email_address, res, robot);
    });

    robot.respond(/check my leave|cml/i, function(res) {
        loadData(function() {
            var id = res.message.user.id;
            var eventId = userMap[id].eventArray[0] || '8cndil7vevad21t9vfng6fisn4';
            google.listFellowEvents(eventId, res);
        });
    });


    /**
     * INTERVIEW FUNCTIONALITY
     */
    robot.respond(/add: (.*)/, function(res) {
        var response = 'Hi ' + res.match[1];
        var slack_id = res.match[1];
        res.send(response);
    });


    /**
     * DB FUNCTIONALITY
     */

    robot.respond(/update/i, function(res) {
        userdb.update(res);
        res.send("updating the user database...");
    });
};
