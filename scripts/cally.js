var interview = require('./interview');
var leave = require('./leave');
var userdb = require('./userdb');
var help = require('./help');

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
    robot.respond(/list-all/i, function(res) {
        leave.listAll('G064YFGG1', res.message.user.id, res);
    });

    robot.respond(/show|sml|show-my-leave/i, function(res) {
        leave.showOne(res.message.user.name, res.message.user.email_address, res, robot);
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
        userdb.update();
        res.send("updating...");
    });
};
