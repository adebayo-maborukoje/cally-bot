'use strict';
var help = require('./help');

module.exports = function(robot) {
  robot.hear(/cally/i, function (res) {
    res.send('Hi My name is Cally and I am here to remind you when your leave will start and other important dates.');
  });
  // robot.respond(/help/i, function (res){
  //   res.send(help.join);
  // });
};