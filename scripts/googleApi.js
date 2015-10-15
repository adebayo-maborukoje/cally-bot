var bluebird = require('bluebird');
var path = require('path');
var axios = require('axios');
var fs = bluebird.promisifyAll(require('fs'));
var token = '';
var request = require('google-oauth-jwt').requestWithJWT();
var googleAuth = bluebird.promisifyAll(require('google-oauth-jwt'));
var userdb = require('./userdb');

var google = require('googleapis'),
    calendar = google.calendar('v3'),
    serviceEmail = '49577347286-824dakpish13virhq8lbinnjn987bqj6@developer.gserviceaccount.com',
    serviceKeyFile = path.join(__dirname, '../my-key-file.pem');


var exports = module.exports = {};

var baseurl = 'https://www.googleapis.com/calendar/v3/calendars/',
    fellowsLeaveCalendarId = 'andela.co_8q5ndpq7vfikvmrinv0oladgd8@group.calendar.google.com',
    staffLeaveCalendarId = 'andela.co_vq4m4skcvvg16f4r7mj33etsk8@group.calendar.google.com',
    birthdayCalendarId = 'andela.co_26ma585mqntc4u4gapgsksahno@group.calendar.google.com',
    interviewCalendarId = 'andela.co_a0s8rmptjt2uee62liudvmsnhg@group.calendar.google.com';

// Axios interceptor
// Sends the Authorization as a Header with every request made to the Api
axios.interceptors.request.use(function(config) {
    config.headers.Authorization = 'Bearer ' + token;
    return config;
});

//  Generates the Access token for the first time if Google returns an error;
var get = function(pathname, params, i) {
    i = i || 3;
    if (i === 0) return bluebird.reject('Token generation failed after 3 attempts');
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

// var post = function(pathname, params, i) {
//   i = i || 3;
//   if (i === 0) return bluebird.reject('Token generation failed after 3 attempts');
//   return axios.post(baseurl + pathname, params).then(function(response) {
//     return response.data;
//   }).catch(function(err) {
//     if (err.status === 401) {
//       return generateToken().then(function() {
//         return post(pathname, params, i--);
//       });
//     } else {
//       return err;
//     }
//   });
// };

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

//get the list of all leave dates Fellows and Staff.
exports.getAllDates = function() {
    return bluebird.all([
        getCalendar(fellowsLeaveCalendarId),
        getCalendar(staffLeaveCalendarId)
    ]).spread(function(fellowData, staffData) {
        var all = fellowData.concat(staffData);
        return all;
    });
};

// Get the List of Birthdays in the birthday Calendar.
exports.getNextBirthday = function() {
    return getCalendar(birthdayCalendarId);
};

function getCalendar(calendarId, max) {
    return get(calendarId + '/events', {
        params: {
            alwaysIncludeEmail: true,
            maxResults: max || 100
        }
    }).then(function(data) {
        return data.items;
    });
}

exports.listFellowEvents = function(eventId, res) {
    return get(fellowsLeaveCalendarId + '/events/' + eventId, {
        params: {
            alwaysIncludeEmail: true,
            maxAttendees: 3
        }
    }).then(function(data) {
        res.send('text');
        return data.items;
    });
};

exports.createLeaveEvent = function(user, info, res) {
    var user = user[0];
    var eventDetails = {
        'summary': 'Leave for ' + user.realName,
        'description': 'Testing CALLY NOW',
        "end": {
            "date": info.endDate //"2015-09-25"
        },
        "start": {
            "date": info.startDate //"2015-09-17"
        },
        'attendees': [{
            'email': user.email
        }, {
            'email': 'people-intern@andela.com'
        }]
    };
    authorizeApp(function(authClient){
        calendar.events.insert({
            auth: authClient,
            calendarId: info.calendarId,
            resource: eventDetails,
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            //event details at this point i would like to save the evnets to the databsase
            var eventObject = {
                userId: user._id,
                slackId: user.slackId,
                email: user.email,
                calendarId: info.calendarId,
                googleEventId: event.id,
                startDate: info.startDate,
                endDate: info.endDate
            };
            userdb.saveLeaveEvent(eventObject, res);
        });
    })
};

exports.removeLeaveEvent = function(leave, res) {
var leave = leave[0];
    authorizeApp(function(authClient) {
        calendar.events.delete({
            auth: authClient,
            calendarId: leave.calendarId,
            eventId: leave.googleEventId
        }, function(err) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            userdb.deleteLeaveEvent(leave._id, res)
        })
    });
};


var authorizeApp = function(callback) {
    fs.readFileAsync(serviceKeyFile).then(function(val) {
        return new google.auth.JWT(
            '49577347286-824dakpish13virhq8lbinnjn987bqj6@developer.gserviceaccount.com',
            null, val, ['https://www.googleapis.com/auth/calendar'],
            'people-intern@andela.com');
    }).then(function(authClient) {
        authClient.authorize(function(err, tokens) {
            if (err) {
                console.log(err);
                return;
            }
            callback(authClient)
        })
    }).catch(function(e) {
        console.log("unable to read file");
    });
};
