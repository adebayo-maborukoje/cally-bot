// THIS FILE WILL HOUSE ALL THE LOGIC FOR CALENDAR DATES
// EXPORT ALL FUNCTIONS


// Admin can view all the leave available
'use strict';
var help = require('./help');
var slackapi = require('./slackapi');
var googleApi = require('./googleApi');
var moment = require('moment');

var Promise = require('bluebird');

// Polyfill
String.prototype.includes = function(value) {
  return this.indexOf(value) !== -1
}

module.exports = function(robot) {

    //Admin can get the list of all calendar events
    robot.hear(/list-all/i, function(res) {
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
        var userName = res.message.user.name;
        var names = res.message.user.email_address.match(/^[^@]+/)[0].split('.')

        googleApi.getAllDates().then(function (data){
          data.map(function(x){
            console.log(x.summary);
          })
          return data.filter(function(x) {
            var name = x.summary
              .match(/^[^(]*/)[0]
              .trim().toLowerCase()

            return names.every(function(y) { return name.includes(y) });
          })
        }).then(function (result){
            var message = result.map(function (data) {
            var status = data.status;
            var startDate = data.start.date || data.start.dateTime;
            var endDate = data.end.date || data.end.dateTime;
              return "Leave will *Start* on :" + startDate + " and will *end* on "+endDate+ " the *Status* is :"+status;
          })
          return (message.join('\n'));
        }).then(function (result) {
          if(!result){
            res.send("I'm sorry "+res.message.user.name +", it seems your leave date has not been registered. kindly contact people-intern@andela.com for more information.")
            return;
          }
          res.send("Hey "+res.message.user.name +" trust you are doing well :smile: this is the information I found about your leave :\n"+ result +" \n Please Note That Saturday and Sunday might be included.")
        });

    });

};
//
// if(!module.parent) {
//   //var user = res.message.user
//   var user = {
//     name: "Emmanuel Isaac",
//     email_address: "emmanuel.isaac@andela.com"
//   }
//   var userName = user.name;
//   var names = user.email_address.match(/^[^@]+/)[0].split('.')
//
//   googleApi.getAllDates().then(function (data){
//     return data.filter(function(x) {
//       var name = x.summary
//         .match(/^[^(]*/)[0]
//         .trim().toLowerCase()
//         // console.log('name', name);
//
//       return names.every(function(y) { return name.includes(y) });
//     })   //var userEmail will be emmanuel.isaac
//   }).then(function (result){
//     // console.log("result:", result)
//       var message = result.map(function (data) {
//       var status = data.status;
//       var startDate = data.start.date || data.start.dateTime;
//       var endDate = data.end.date || data.end.dateTime;
//       // console.log(status, startDate, endDate)
//         return "Leave will *Start* on :" + startDate + " and will *end* on "+endDate+ " the *Status* is :"+status;
//     })
//     return(message.join('\n'));
//   }).then(function (result) {
//     console.log("Hey "+user.name +" trust you are doing well :-) this is the information I found about your leave :\n"+ result +" \n Please Note That Saturday and Sunday might be included.");
//     res.send("Hey "+res.message.user.name +" trust you are doing well :-) this is the information I found about your leave :\n"+ result +" \n Please Note That Saturday and Sunday might be included.")
//   });
//
// }
if(!module.parent) {
    var date = new Date();
    var today = Date.now();
    var oneMonth = moment().add(1, 'month').calendar();
        oneMonth = oneMonth.replace(/[/]/g, "-")
    var getFormat = moment("12\/25\/1995", "MM-DD-YYYY");
    console.log("getFormat".getFormat)
    console.log("moment", moment().format());
    console.log("date", date)
    console.log("today", today)
    console.log("One - months", oneMonth)
    console.log(oneMonth === "08/25/2015");
    console.log(oneMonth === "08-25-2015");

    // return (isMember !== -1);

}
