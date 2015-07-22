// THIS FILE WILL HOUSE ALL THE LOGIC FOR CALENDAR DATES
// EXPORT ALL FUNCTIONS


// Admin can view all the leave available
'use strict';
var help = require('./help');
var BaseUrl = 'https://slack.com/api/';
var token = 'xoxb-6098518390-PMvTDFpU7DcunPMV3YIWyYS0';
var axios = require('axios');
var googleApi = require('./googleApi');

var Promise = require('bluebird');

module.exports = function(robot) {

    //Admin can get the list of all calendar events
    robot.hear(/list-all/i, function(res) {
        var channel = 'G064YFGG1'; // This is test-cally channel id
        var isMemberPromise = belongsToGroup(channel, res.message.user.id).then(function(isMember) {
            return (isMember !== -1);
        });

        var isAdminPromise = isAdmin(res.message.user.id);
        Promise.all([isMemberPromise, isAdminPromise]).spread(function(isMember, isAdmin) {
            if (isMember || isAdmin) {
                return googleApi.getAllDates();
            } else {
                return [];
            }
        }).then(function(dates) {
            var messages = dates.map(function(date) {
                var id = date.id;
                var status = date.status;
                var startDates = date.start.dateTime || date.start.date;
                return id + ' - ' + status + ' - ' + startDates;
            });
            res.send(messages.join('\n'));
        }).catch(function(err) {
            console.log('Error', err.stack);
        });
    });

    // get single user leave date
    // a Single user can check his/her own leave date
    robot.hear(/show/i, function(res) {
        console.log(res);
        var userName = res.message.user.name;
        var userEmail = res.message.user.email_address;
        // console.log('user', user);
        // send email to google to fetch the leave date of that user
    });

    function isAdmin(userid) {
        //this is the admin user (sayo -- used in test case for admin users)
        // userid = 'U03LJ0TRH';
        return axios.get(BaseUrl + 'users.info?token=' + token + '&user=' + userid)
            .then(function(response) {
                var andela = response.data;
                return andela.user.is_admin;
            });
    }

    // this check is necessary in other to allow some non admin user also check the list
    // However only users belonging to a particular private channel will be privy to it.

    function belongsToGroup(channel, requester) {
        // channel = 'G064YFGG1';
        return axios.get(BaseUrl + 'groups.info?token=' + token + '&channel=' + channel).then(function(response) {
            var slackGroupMembers = response.data.group.members;
            var isMember = slackGroupMembers.indexOf(requester);
            return isMember;
        });
    }
};
