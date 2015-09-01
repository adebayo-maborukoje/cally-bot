var interview = require('./interview');
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

    robot.respond(/add: (.*)/, function(res) {
        console.log('default', res);
        var response = 'Hi ' + res.match[1];
        var slack_id = res.match[1];
        interview.addFellowToInterviewTeam(slack_id);

        res.send(response);
    });
};
