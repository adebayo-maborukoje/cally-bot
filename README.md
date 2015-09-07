# cally-bot
A Bot that schedules recruitment training appointments and also reminds fellows and staffs of their leave due date

## Important Information For Team Leave
* After cloning(pulling) the repo, run `npm install`  

* To get cally-bot running in development, run `gulp cally` 

* This is what a curl request to get the info from the api looks like 

    ```
    curl -H "Authorization: Bearer ya29.lQFzXcws-7UgDZGw-FF_NeGZGRqVZzohGbIUeCEeuxlKojRN1j0k6lF-WggwQtxFQmG6wDhs0TPqhg" https://www.googleapis.com/calendar/v3/calendars/andela.co_8q5ndpq7vfikvmrinv0oladgd8@group.calendar.google.com
    ```
In this sequence `curl -H "Authorization: Bearer <GENERATED-TOKEN>" <CALENDAR_ID>`

* All of this can be seen with through google's calendar api [documentation](https://developers.google.com/google-apps/calendar/v3/reference/) 

*Make sure to update the help.js module.exports array with the commad syntax and short description of what it does. 

###Files 
### Files 
##### cally-bot/
* scripts/birthday.js               : logic for birthday aspect of cally
* scripts/birthdayMessages.json     : template birthday messages stored
* scripts/cally.js                  : core logic for calling file functions and using their responses
* scripts/googleApi.js              : logic for goolgle api requests
* scripts/help.js                   : display of all cally's listener commands
* scripts/interview.js              : logic for interview aspect of cally
* scripts/leave.js                  : logic for leave aspect of cally
* scripts/mongolab-connection.js    : setup for the mongolab connection and local developement
* scripts/slackapi.js               : logic for slack api requests
* scripts/userdb.js                 : logic for operations on users in database
* gulpfile.js                       : automated tasks
* shell.js                          : essential script for running hubot. required in the gulpfile 


I followed this [article](https://github.com/extrabacon/google-oauth-jwt) to achieve the most of the above.

## Persistence

## Deployment



