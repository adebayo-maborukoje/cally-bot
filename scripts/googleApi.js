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
axios.interceptors.request.use(function(config) {
    config.headers.Authorization = 'Bearer ' + token;
    return config;
});

var get = function(path, params, i) {
    i = i || 3;
    if (i === 0) return Promise.reject('Token generation failed after 3 attempts');
    return axios.get(baseurl + path, params).then(function(response) {
        var status = response.status;
        if (status === 401) {
            return generateToken().then(function() {
                return get(path, params, i--);
            });
        } else if (status >= 200 && status < 300) {
            return response.data;
        } else {
            throw new Error(response.data.error);
        }
    });
};

var generateToken = function() {
    googleAuth.authenticateAsync({
        // use the email address of the service account, as seen in the API console
        email: '403378786560-4hlr4s47r5ctmh28r4p5q65tmtittjai@developer.gserviceaccount.com',
        // use the PEM file we generated from the downloaded key
        keyFile: path.join(__dirname, '../my-key-file.pem'),
        // specify the scopes you wish to access
        scopes: ['https://www.googleapis.com/auth/calendar']
    }).then(function(newToken) {
        console.log('token', token);
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
    return get(calendarId + '/events', {
        params: {
            alwaysIncludeEmail: true,
            maxResults: 10
        }
    }).then(function(response) {
        console.log(response);
        return response.data.items;
    });
};

var getUniqueDate = function(eventId) {
    return get(calendarId + '/events/' + eventId, {
        params: {
            alwaysIncludeEmail: true
        }
    }).then(function(response) {
        console.log(response);
        return response.data;
    });
};

module.exports = {
    getAllDates: getAllDates,
    getUniqueDate: getUniqueDate
};


if (!module.parent) { // Only run when not included
    get(calendarId + '/events').then(function(data) {
        console.log(data);
    }).catch(function(err) {
        console.log(err.data.error);
    });
}
