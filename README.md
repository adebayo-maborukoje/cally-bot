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
cally-bot/
* scripts/token.js : code that generates token on `leave` command currently 
* scripts/cally.js : code that will house logic for calling file functions and using their responses
* scripts/interview.js : code that will house core logic for the interview aspect of cally
* scripts/leave.js : code that will house core logic for the calendar aspect of cally
* scripts/help.js : code for cally's listener commands
* gulpfile.js : our tasks
* cally-bot/shell.js : code that contains script for running hubot on command line. It is required in the gulpfile 
* my-key-file.pem : contains the private key that is generated from the developer account. 
* token.txt : contains the token called recieved from google. 


I followed this [article](https://github.com/extrabacon/google-oauth-jwt) to achieve the most of the above.

## Persistence

## Deployment



