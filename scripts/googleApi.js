'use strict';

var Promise = require('bluebird');
var path = require('path');
var axios = require('axios');
var fs = Promise.promisifyAll(require('fs'));
//var token = fs.readFileSync('token.txt').toString(); // this file does not exist at the moment
var token = '';
var request = require('google-oauth-jwt').requestWithJWT();
var googleAuth = Promise.promisifyAll(require('google-oauth-jwt'));

var baseurl = 'https://www.googleapis.com/calendar/v3/calendars/',
  fellowsLeaveCalendarId = 'andela.co_8q5ndpq7vfikvmrinv0oladgd8@group.calendar.google.com',
  staffLeaveCalendarId = 'andela.co_vq4m4skcvvg16f4r7mj33etsk8@group.calendar.google.com',
  birthdayCalendarId = 'andela.co_26ma585mqntc4u4gapgsksahno@group.calendar.google.com',
  interviewCalendarId = 'andela.co_a0s8rmptjt2uee62liudvmsnhg@group.calendar.google.com';

// Axios interceptor
// Sends the Authorization as an Header with every request made to the Api
axios.interceptors.request.use(function(config) {
  config.headers.Authorization = 'Bearer ' + token;
  return config;
});

//  Generates the Access token for the first time if Google returns an error;
var get = function(pathname, params, i) {
  i = i || 3;
  if (i === 0) return Promise.reject('Token generation failed after 3 attempts');
  return axios.get(baseurl + pathname, params).then(function(response) {
    return response.data;
  }).catch(function(err) {
    if (err.status === 401) {
      return generateToken().then(function() {
        return get(pathname, params, i--);
      });
    } else {
      return err;
    }
  });
};

//  Generates a Token using Google Auth
var generateToken = function() {
  return googleAuth.authenticateAsync({
    // use the email address of the service account, as seen in the API console
    email: '49577347286-824dakpish13virhq8lbinnjn987bqj6@developer.gserviceaccount.com',
    // use the PEM file we generated from the downloaded key
    keyFile: path.join(__dirname, '../my-key-file.pem'),
    // specify the scopes you wish to access
    scopes: ['https://www.googleapis.com/auth/calendar'],
    delegationEmail: 'chibuzor.obiora@andela.com'
  }).then(function(newToken) {
    token = newToken;
    return fs.writeFileAsync('token.txt', token);
  }).then(function(message) {
    console.log('done');
  }).catch(function(err) {
    console.log('problem,', err.message);
  });
};

//get the list of all leave dates
var getAllDates = function() {
  return get(fellowsLeaveCalendarId + '/events', {
    params: {
      alwaysIncludeEmail: true,
      maxResults: 100
    }
  }).then(function(data) {
    console.log('data', data);
    return data.items;
  });
};

var getNextBirthday = function() {
  return get(birthdayCalendarId + '/events', {
    params: {
      alwaysIncludeEmail: true
    }
  }).then(function(result) {
    return result.items;
  });
};

module.exports = {
  getAllDates: getAllDates,
  getNextBirthday: getNextBirthday
};

if (!module.parent) { // Only run when not included
    get(fellowsLeaveCalendarId + '/events').then(function(data) {
        console.log(data.items.map(function(item) {
          return item.summary
        }).join("\n"));
    }).catch(function(err) {
        console.log(err.data.error);
    });
}