var axios = require('axios');
var googleService = require('./googleApi');
var CronJob = require('cron').CronJob;
var hogan = require("hogan.js");
var birthdayTemplates = require('./birthdayMessages.json');

module.exports = function(robot) {
    var sendBirthdays = function() {
        // Retrieve from google
        return googleService.getNextBirthday().then(function(birthdays) {
            var date = new Date();
            var today = date.getFullYear() + '-' + pad(date.getMonth() + 1, 2) + '-' + pad(date.getDate(), 2);
            return birthdays.filter(function(event) {
                return event.start.date === today;
            });
        }).then(function(todayBirthdays) {
            if (todayBirthdays.length === 0) return;

            var message = todayBirthdays.map(function(obj) {
                return obj.summary;
            }).map(function(name) {
                var msg = birthdayTemplates[Math.floor(Math.random() * birthdayTemplates.length)];
                return hogan.compile(msg).render({
                    name: name
                });
            }).join("\n");
            robot.send({
                room: '#random',
            }, message);
 
        }).catch(function(err) {
            console.log('err', err);
        });
    };
    // This is the scheduler that sends Birthday messages every 8 am of the day whenever there is a Birthday.
    new CronJob('00 00 08 * * *', sendBirthdays, null, true);

};

// this is to append 0 to dates that are single digit
var pad = function(str, length) {
    str = str.toString();
    length = length || 2;
    if (str.length < length) return pad("0" + str);
    return str;
};
