// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var needle = require('needle');
var path = require('path');
// obtain a JWT-enabled version of request
var request = require('google-oauth-jwt').requestWithJWT();
var googleAuth = require('google-oauth-jwt');
var bearer;

module.exports = function(robot) {
    robot.hear(/generateNewToken/i, function(res) {
        googleAuth.authenticate({
            // use the email address of the service account, as seen in the API console
            email: '403378786560-4hlr4s47r5ctmh28r4p5q65tmtittjai@developer.gserviceaccount.com',
            // use the PEM file we generated from the downloaded key
            keyFile: path.join(__dirname, '../my-key-file.pem'),
            // specify the scopes you wish to access
            scopes: ['https://www.googleapis.com/auth/calendar']
        }, function(err, token) {
            console.log('token', token);
            bearer = token;
        });
        // res.send('');
    });
};
