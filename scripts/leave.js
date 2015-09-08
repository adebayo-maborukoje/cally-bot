var help = require('./help');
var slackApi = require('./slackapi');
var googleApi = require('./googleApi');
var moment = require('moment');
var CronJob = require('cron').CronJob;
var bluebird = require('bluebird');

var exports = module.exports = {};
//Function helpers

// Polyfill in other to use includes.
String.prototype.includes = function(value) {
    return this.indexOf(value) !== -1;
};

//Polyfilling Array .find
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

/*
 * returns a formated year from the
 * @param (2015-08-20)
 * Output : Saturday, 20th Day of August
 */
function getDayOfTheWeek(day) {
    return moment(day).format("dddd Do of MMMM");
}

/*
 * returns the username if the spell check difference is just less than two
 * @input (two items to compare)
 * Output : returns boolean;
 */
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}


exports.listAll = function(channelId, userId, res) {
    var isMemberPromise = slackApi.getGroup(channelId, userId).then(function(isMember) {
        return (isMember !== -1);
    });
    var isAdminPromise = slackApi.getUserFromSlack(userId);

    bluebird.all([isMemberPromise, isAdminPromise]).spread(function(isMember, isAdmin) {
        if (isMember || isAdmin) {
            return googleApi.getAllDates();
        } else {
            return [];
        }
    }).then(function(dates) {
        var messages = dates.map(function(date) {
            var name = date.summary.match(/^[^(]*/)[0];
            var status = date.status;
            var startDates = date.start.date || date.start.dateTime;
            var endDate = date.end.date || date.end.dateTime;
            return '```' + name + ' - from ' + getDayOfTheWeek(startDates) + ' - to ' + getDayOfTheWeek(endDate) + ' - ' + status + '```';
        });
        res.send(messages.join('\n'));
    }).catch(function(err) {
        console.log('Error', err.stack);
    });
};

exports.showOne = function(userName, userEmailAdress, res, robot) {
    var names = userEmailAdress.match(/^[^@]+/)[0].split('.');

    googleApi.getAllDates().then(function(data) {
        return data.filter(function(x) {
            var name = x.summary
                .match(/^[^(]*/)[0]
                .trim().toLowerCase();

            return names.every(function(y) {
                return name.includes(y);
            });
        });
    }).then(function(result) {
        var message = result.map(function(data) {
            var status = data.status;
            var startDate = data.start.date || data.start.dateTime;
            var endDate = data.end.date || data.end.dateTime;
            return "Start Day:" + getDayOfTheWeek(startDate) + ". End Date: " + getDayOfTheWeek(endDate) + ",  Status :" + status;
        });
        return (message.join('\n'));
    }).then(function(result) {
        if (!result) {
            res.send("I'm sorry " + userName + ", it seems your leave date has not been registered. kindly contact people-intern@andela.com for more information.")
            return;
        }
        var msg = "Hey " + userName + " trust you are doing well :smile: this is the information I found about your leave :\n" + result + " \n Contact people-intern@andela.co for more info.";

        robot.emit('slack-attachment', {
            content: {
                fallback: msg,
                pretext: "Leave Request Information",
                text: msg,
                color: '#7CD197'
            },
            channel: userName
        });
    });
};




//Get todays date and calculate one month from now.
//Used by the Cron Job in createJob
var sendLeaveNotice = function(dateToQuery, duration) {
    var namesPromise = googleApi.getAllDates().then(function(leavedates) {
        return leavedates.filter(function(event) {
            return event.start.date === dateToQuery;
        });
    }).then(function(todaysLeavenotice) {

        return todaysLeavenotice.map(function(obj) {
            var name = obj.summary
                .match(/^[^(]*/)[0]
                .trim().toLowerCase();
            return name.replace(' ', '.');
        });
    });

    var slackusersPromise = slackApi.getAllSlackMembers().then(function(slackusers) {
        return slackusers.map(function(x) {
            return [
                x.email.match(/^[^@]+/)[0],
                x.name,
                x.real_name,
                x.real_name.toLowerCase().replace(' ', '.'),
            ];
        });
    });

    bluebird.all([namesPromise, slackusersPromise]).spread(function(ids, idToRoomNames) {
            var weirdNames = {
                'ijeoma.arisah': ['', 'jay', 'Jay']
            };
            ids.map(function(id) {
                    if (weirdNames[id]) return weirdNames[id];
                    var revid = id.split('.').reverse().join('.');
                    var y = idToRoomNames.find(function(idWithRoomName) {
                        var currid = idWithRoomName[0];
                        var curridbackup = idWithRoomName[3];
                        return id === currid || revid === currid || id === curridbackup || revid === curridbackup || levenshteinDistance(id, currid) < 3;
                    });
                    if (y === undefined) {
                        console.log(y);
                        //   var msg = y + " could not be found in the database it could be a wrong spelling. kindly check the user information"
                        // robot.send({
                        //   room: 'i-cally-bot'
                        // }, msg )
                    }
                    return y;
                })
                .filter(function(x) {
                    return x !== undefined;
                })
                .map(function(x) {
                    return x[1];
                })
                .forEach(function(name) {
                    var msg = "Hey " + name + ", your leave is coming up on " + duration + " from now, " + getDayOfTheWeek(dateToQuery) + ", If you haven’t, please inform your client/trainer/line manager of your upcoming leave. Upon approval, forward to people-intern@andela.com. Thank you. :smile:";
                    robot.emit('slack-attachment', {
                        content: {
                            fallback: msg,
                            pretext: "Personal Holiday Information",
                            text: msg,
                            color: '#7CD197'
                        },
                        channel: name
                    });
                });
        })
        .catch(function(err) {
            console.log('err', err.stack);
        });
};

/*
 * a wrapper function for the cron jobs
 * @param ({}, string)
 * Output : calls another function
 */
function createJob(deltaTime, duration) {
    return function g() {
        var time = moment().add(deltaTime).format('YYYY-MM-DD');
        sendLeaveNotice(time, duration);
    };
}


new CronJob('00 00 11 * * *', createJob({
    months: 1
}, "One Month"), null, true);
new CronJob('00 30 11 * * *', createJob({
    weeks: 2
}, "2 weeks"), null, true);
// new CronJob('00 30 10 * * *', createJob({days: 3}, "3 days"), null, true);
