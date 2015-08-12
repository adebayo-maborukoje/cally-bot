// REQUIRE ALL THE OTHER FILES
// CORE LOGIC FOR THE APP
var interview = require('./interview');


module.exports = function(robot) {
    /**INTERVIEW**/
    robot.respond(/add: (.*)/, function() {
        interview.addFellowToInterviewTeam(fellow);
    });
};