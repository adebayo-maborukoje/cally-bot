'use strict';

//This is to communicate directly with google calendar Api.
//https://www.googleapis.com/calendar/v3/calendars/calendarId/events

var Promise = require('bluebird');
var path = require('path');

// obtain a JWT-enabled version of request
var request = require('google-oauth-jwt').requestWithJWT();
var googleAuth = Promise.promisifyAll(require('google-oauth-jwt'));
var baseurl = 'https://www.googleapis.com/calendar/v3/calendars/',
    calendarId = 'andela.co_8q5ndpq7vfikvmrinv0oladgd8@group.calendar.google.com';
var axios = require('axios');
var fs = Promise.promisifyAll(require('fs'));
var token = fs.readFileSync('token.txt').toString();

// Axios interceptor
// Sends the Authorization as an Header with every request made to the Api
axios.interceptors.request.use(function(config) {
    config.headers.Authorization = 'Bearer ' + token;
    return config;
});

//  Generates the Access token for the first time if Google returns an error;
//
var get = function(path, params, i) {
    i = i || 3;
    if (i === 0) return Promise.reject('Token generation failed after 3 attempts');
    return axios.get(baseurl + calendarId + '/' + path, params).then(function(response) {
        return response.data;
    }).catch(function(err) {
        if (err.status === 401) {
            return generateToken().then(function() {
                return get(path, params, i--);
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
        email: '403378786560-4hlr4s47r5ctmh28r4p5q65tmtittjai@developer.gserviceaccount.com',
        // use the PEM file we generated from the downloaded key
        keyFile: path.join(__dirname, '../my-key-file.pem'),
        // specify the scopes you wish to access
        scopes: ['https://www.googleapis.com/auth/calendar']
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
    return get('events', {
        params: {
            alwaysIncludeEmail: true,
            maxResults: 10
        }
    }).then(function(data) {
        console.log('data', data);
        return data.items;
    });
};

module.exports = {
    getAllDates: getAllDates,
};
