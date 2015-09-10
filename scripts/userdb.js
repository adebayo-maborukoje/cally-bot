var db = require('./mongolab-connection');
var slackapi = require('./slackapi');
var mongoose = require('mongoose');
var _ = require('lodash');

var exports = module.exports = {};

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var SlackUser = new Schema({
    author: ObjectId,
    slackId: String,
    email: String,
    eventArray: [],
    totalNumberBooked: Number,
    numberTaken: Number
});
var SlackUser = mongoose.model('SlackUser', SlackUser);

exports.update = function(res) {
    slackapi.getAllSlackMembers().then(function(results) {

        SlackUser.collection.remove();
        results.map(function(n) {
            var user = new SlackUser();
            user.slackId = n.id;
            user.email = n.email;
            return user.save();
        });
        res.send("Done updating");
    });
};

exports.SlackUser = SlackUser;
