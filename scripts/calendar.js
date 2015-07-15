// THIS FILE WILL HOUSE ALL THE LOGIC FOR CALENDAR DATES
// EXPORT ALL FUNCTIONS


// Admin can view all the leave available
'use strict';
var help = require('./help');
var BaseUrl = 'https://slack.com/api/';
var token = 'xoxb-6098518390-PMvTDFpU7DcunPMV3YIWyYS0';
var axios = require('axios');
var googleApi = require('./googleApi');

module.exports = function(robot) {
    //Admin can get the list of all calendar events
    robot.hear(/list-all/i, function(res) {

        isAdmin(res.message.user.id).then(function(isAnAdmin) {
            if (isAnAdmin) {
                console.log("is an admin!")
                return googleApi.getAllDates();
            } else {
                console.log("not an admin!")
                return []; // Not admin, retrieve just some dates
            }
        }).then(function(dates) {
            console.log('dates:', dates);
            var messages = dates.map(function(date) {
                var id = date.id;
                var status = date.status;
                var startDates = date.start.dateTime || date.start.date;
                return id + ' - ' + status + ' - ' + startDates;
            });

            res.send(messages.join("\n"));
        }).catch(function(err) {
            console.log("ERR:", err);
        });
    });

    // get single user leave date
    // a Single user can check his/her own leave date
    robot.hear(/show/i, function(res) {
      console.log(res);
        var userName = res.message.user.name;
        var userEmail = res.message.user.email_address;
        console.log('user', user);
        // send email to google to fetch the leave date of that user
    });



    // function listAll() {
    //     axios.get(BaseUrl + 'users.list?token=xoxb-6098518390-PMvTDFpU7DcunPMV3YIWyYS0')
    //         .then(function(response) {
    //             var andela = response.data;
    //             // console.log('total ', andela.members.is_admin);
    //         });
    // }

    function isAdmin(userid) {
        //this is the admin user (sayo-- used in test case for admin users)
        userid = 'U03LJ0TRH';
        return axios.get(BaseUrl + 'users.info?token=' + token + '&user=' + userid)
            .then(function(response) {
                var andela = response.data;
                console.log('hss', andela.user.is_admin);
                return andela.user.is_admin;
            });
    }

    // this check is necessary in other to allow some non admin user also check the list
    // However only users belonging to a particular private channel will be privy to it.

    // function beleongsToGroup() {
    // robot.http(BaseUrl+'groups.list?token='+token).get()(function (err, resp, data){
    //   var groups = JSON.parse(data);

    // });

};
