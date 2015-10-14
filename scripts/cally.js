var interview = require('./interview');
var leave = require('./leave');
var userdb = require('./userdb');
var help = require('./help');
var googleService = require('./googleApi');

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

    var userSlackIdMap = {};
    var userSlackHandleMap = {};
    var loadData = function(callback) {
        userdb.SlackUser.find(function(err, all) {
            for (var i = 0; i < all.length; i++) {
                userSlackIdMap[all[i].slackId] = all[i];
                userSlackHandleMap[all[i].name] = all[i];
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
        });
    });

    robot.respond(/create event: (.*)/i, function(res){
        var data = res.match[1].split(/[\s,]+/);
        var name = data[0];
         //TODO: Has to exist error handle this use res for it 
        var info = {
            name: name,
            startDate: data[1],
            endDate: data[2],
        };
        //all three fields must exist.
        res.send('setting up '+name+ '\'s leave...');
        leave.createLeave(name, info, res);
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
