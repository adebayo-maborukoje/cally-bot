// REQUIRE ALL THE OTHER FILES
// CORE LOGIC FOR THE APP
var interview = require('./interview');
var help = require('./help');


module.exports = function(robot) {

    robot.respond(/help/i, function(res) {
        var emit;
        emit = help.join("\n");
        res.send(emit);
    });

    robot.respond(/hi Cally || hi/i, function(res) {
        var response = 'Hi ' + res.message.user.name + ', My name is Cally and I am here to' +
                        'remind you when your leave will start and other important dates.';
        res.send(response);
    });



    /**INTERVIEW**/
    // robot.respond(/add: (.*)/, function() {
    //     interview.addFellowToInterviewTeam(fellow);
    // });
};
