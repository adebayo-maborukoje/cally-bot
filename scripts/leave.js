// THIS FILE WILL HOUSE ALL THE LOGIC FOR CALENDAR DATES
// EXPORT ALL FUNCTIONS


// Admin can view all the leave available
'use strict';
var help = require('./help');
var slackapi = require('./slackapi');
var googleApi = require('./googleApi');
var moment = require('moment');
var CronJob = require('cron').CronJob;

var Promise = require('bluebird');

// Polyfill in other to use includes.
String.prototype.includes = function(value) {
    return this.indexOf(value) !== -1
}

module.exports = function(robot) {
    //Admin can get the list of all calendar events
    robot.respond(/list-all/i, function(res) {
        var channel = 'G064YFGG1'; // This is test-cally channel id
        var isMemberPromise = slackapi.getGroup(channel, res.message.user.id).then(function(isMember) {
            return (isMember !== -1);
        });

        var isAdminPromise = slackapi.getUserFromSlack(res.message.user.id);
        Promise.all([isMemberPromise, isAdminPromise]).spread(function(isMember, isAdmin) {
            if (isMember || isAdmin) {
                return googleApi.getAllDates();
            } else {
                return [];
            }
        }).then(function(dates) {
            var messages = dates.map(function(date) {
                var name = date.summary.match(/^[^(]*/)[0]
                var status = date.status;
                var startDates = date.start.date || date.start.dateTime;
                return name + ' - ' + status + ' - ' + startDates;
            });
            res.send(messages.join('\n'));
        }).catch(function(err) {
            console.log('Error', err.stack);
        });
    });

    // get single user leave date
    // a Single user can check his/her own leave date
    robot.respond(/show|sml|show-my-leave/i, function(res) {
        var userName = res.message.user.name;
        var names = res.message.user.email_address.match(/^[^@]+/)[0].split('.')

        googleApi.getAllDates().then(function(data) {
            data.map(function(x) {
                console.log(x.summary);
            })
            return data.filter(function(x) {
                var name = x.summary
                    .match(/^[^(]*/)[0]
                    .trim().toLowerCase()

                return names.every(function(y) {
                    return name.includes(y)
                });
            })
        }).then(function(result) {
            var message = result.map(function(data) {
                var status = data.status;
                var startDate = data.start.date || data.start.dateTime;
                var endDate = data.end.date || data.end.dateTime;
                return "Leave will *Start* on :" + startDate + " and will *end* on " + endDate + " the *Status* is :" + status;
            })
            return (message.join('\n'));
        }).then(function(result) {
            if (!result) {
                res.send("I'm sorry " + res.message.user.name + ", it seems your leave date has not been registered. kindly contact people-intern@andela.com for more information.")
                return;
            }
            res.send("Hey " + res.message.user.name + " trust you are doing well :smile: this is the information I found about your leave :\n" + result + " \n Please Note That Saturday and Sunday might be included.")
        });

    });

    //Get todays date and calculate one month from now.
    var sendLeaveNotice = function() {
            return googleApi.getLeaveDates().then(function(leavedates) {
                var date = new Date()
                var oneMonth = moment().add(1, 'month').calendar();
                oneMonth = oneMonth.replace(/[/]/g, "-")
                return leavedates.filter(function(event) {
                    console.log('event', event.start.date)
                    console.log('one month', oneMonth)
                    return event.start.date === oneMonth;
                });
            }).then(function(todaysLeavenotice) {
                console.log('leave notice', todaysLeavenotice)
                if (todaysLeavenotice.length === 0)
                    return;
                var message = todaysLeavenotice.map(function(obj) {
                    return obj.summary;
                }).map(function(name) {
                    console.log('name', name)
                    var msg = "Your leave starts in the next one month!"
                        // var msg = leaveTemplates[Math.floor(Math.random() * leaveTemplates.length)];
                    return msg;

                }).join("\n");
                robot.send({
                        room: 'susan'
                    }, message)
                    // robot.send({room: 'adebayo.m'}, message)

            }).catch(function(err) {
                console.log('err', err);
            });
        }
        // This is the scheduler that sends leave messages .
        // new CronJob('00 00 08 * * *', sendLeaveNotice, null, true)
    new CronJob('00/05 * * * * *', sendLeaveNotice, null, true)
};


    // This checks if the requester is and admin on slack.
    function isAdmin(userid) {
        //this is the admin user (sayo -- used in test case for admin users)
        return axios.get(BaseUrl + 'users.info?token=' + token + '&user=' + userid)
            .then(function(response) {
                var andela = response.data;
                return andela.user.is_admin;
            });
    }

    // This check is necessary in other to allow some non admin user also check the list
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
