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
    name: String,
    email: String,
    realName: String,
    realNameNormalised: String,
});
var SlackUser = mongoose.model('SlackUser', SlackUser);

exports.update = function() {
    slackapi.getAllSlackMembers().then(function(results) {
        
        SlackUser.collection.remove();
        results.map(function(n) {
            var user = new SlackUser();
            user.slackId = n.id;
            user.name = n.name;
            user.email = n.email;
            user.realName = n.real_name;
            user.realNameNormalised = n.real_name_normalised;
            return user.save();
        });
    });
};

// create hashmap with all of this and export that. slack handle and slack_id
