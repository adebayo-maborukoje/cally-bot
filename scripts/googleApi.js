'use strict';

//This is to communicate directly with google calendar Api.
//https://www.googleapis.com/calendar/v3/calendars/calendarId/events

var baseurl = 'https://www.googleapis.com/calendar/v3/calendars/',
    calendarId = 'andela.co_8q5ndpq7vfikvmrinv0oladgd8@group.calendar.google.com';
var axios = require('axios');
var token = require('fs').readFileSync('token.txt').toString();

// Axios interceptor
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = 'Bearer ' + token;
  return config;
});


//get the list of all leave dates
var getAllDates = function () {
  return axios.get(baseurl+calendarId+'/events', { params: {alwaysIncludeEmail: true, maxResults: 1}}).then(function(stuff) {
    console.log(stuff);
    return stuff.data.items;
  });
};

module.exports = {
  getAllDates: getAllDates
};


if(!module.parent) { // Only run when not included
  getAllDates().then(function(stuff) {
    console.log(stuff);
  }).catch(function(err) {
    console.log(err.data.error);
  });
}