var _ = require('lodash');
var db = require('./mongolab-connection');
var slackApi = require('./slackapi');

var exports = module.exports = {};


exports.addFellowToInterviewTeam = function() {};

exports.deleteFellowFromInterviewTeam = function() {};

exports.updateAddedFellow = function() {};

exports.getTrainerSchedule = function() {};

//abstract this method
exports.createCalendarEvent = function() {};


exports.sendAvailableTrainerSchedulesToFellows = function() {};

exports.getFellowChoiceOfSchedule = function() {};

exports.addMemberInterviewerToCalendarEvent = function() {};

//abstract this mmethod 
exports.remindInterviewersAboutMeeting = function() {};
