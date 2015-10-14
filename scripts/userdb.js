var db = require('./mongolab-connection');
var slackapi = require('./slackapi');
var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('lodash');

var exports = module.exports = {};

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var SlackUser = new Schema({
    slackId: String,
    email: String,
    handle: String, 
    realName: String
});
var SlackUser = mongoose.model('SlackUser', SlackUser);


exports.update = function(res) {
    slackapi.getAllSlackMembers().then(function(results) {

        SlackUser.collection.remove();
        results.map(function(n) {
            var user = new SlackUser();
            user.slackId = n.id;
            user.email = n.email;
            user.handle = n.name;
            user.realName = n.real_name_normalised;
            return user.save();
        });
        res.send("Done updating");
    });
};


var LeaveEvent = new Schema({
    userId: String,
    userEmail: String,
    slackId: String,
    googleEventId: String,
    startDate: Date,
    endDate: Date,
    numberOfDaysBooked: Number
});
var LeaveEvent = mongoose.model('LeaveEvent', LeaveEvent);


exports.saveLeaveEvent = function(eventObject, res) {
    var leaveEvent = new LeaveEvent();

    leaveEvent.userId = eventObject.userId
    leaveEvent.slackId = eventObject.slackId;
    leaveEvent.userEmail = eventObject.email;
    leaveEvent.googleEventId = eventObject.googleEventId;
    leaveEvent.startDate = eventObject.startDate;
    leaveEvent.endDate = eventObject.endDate;

    var dur = moment(eventObject.endDate.replace('-',' '), 'YYYY MM DD').diff(moment(eventObject.startDate.replace('-',' '), 'YYYY MM DD'));
    leaveEvent.numberOfDaysBooked = moment.duration(dur).asDays();
    leaveEvent.save();
    res.send("done")
};


exports.SlackUser = SlackUser;
exports.LeaveEvent = LeaveEvent;
