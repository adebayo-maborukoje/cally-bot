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
    res.send("Updating the database...")
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
        res.send("Done!");
    });
};


var LeaveEvent = new Schema({
    userId: String,
    userEmail: String,
    slackId: String,
    googleEventId: String,
    calendarId: String,
    startDate: Date,
    endDate: Date,
    numberOfDaysBooked: Number,
    hasBeenTaken: Boolean //flag
});
var LeaveEvent = mongoose.model('LeaveEvent', LeaveEvent);


exports.saveLeaveEvent = function(eventObject, res) {
    var leaveEvent = new LeaveEvent();
    var momentStartDate = moment(eventObject.startDate.replace('-', ' '), 'YYYY MM DD'),
        momentEndDate = moment(eventObject.endDate.replace('-', ' '), 'YYYY MM DD'),
        dur = momentEndDate.diff(momentStartDate);

    leaveEvent.userId = eventObject.userId
    leaveEvent.slackId = eventObject.slackId;
    leaveEvent.userEmail = eventObject.email;
    leaveEvent.googleEventId = eventObject.googleEventId;
    leaveEvent.startDate = eventObject.startDate;
    leaveEvent.calendarId = eventObject.calendarId;
    leaveEvent.endDate = eventObject.endDate;
    leaveEvent.numberOfDaysBooked = moment.duration(dur).asDays();
    leaveEvent.hasBeenTaken = moment().diff(momentStartDate) > 1; //true if today is in the future of the start date.
    //save to the database.
    leaveEvent.save();
    res.send('done')
};

exports.deleteLeaveEvent = function(leaveId, res) {
    LeaveEvent.findOne({
        _id: leaveId
    }, function(err, leave){
        leave.remove();
        res.send('done');
    });
};


exports.SlackUser = SlackUser;
exports.LeaveEvent = LeaveEvent;
