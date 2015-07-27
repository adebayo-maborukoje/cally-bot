/***
This file would contain all the logic for implementing the use cases for the interview bookings

Book a date. (abstract this function for everyone) from slack
1. will be responsible for scheduling meetings between Fellows who are joining the interviewers team and the trainers,  
2. will pitch fellows and trainers according to their choice of dates  and 
3. will also send out reminders to fellows and trainers of their scheduled meeting 
4. will send notifications to the admin on regular basis


fellow completes training and joins interview-team 
admin adds fellow by slack handles to the cali-interview array. 
fellow gets message from cally telling her that she has been added to the interview - team
   and would be getting notoifications for such
next up is the fellow gets a notification from the for the list of available dates [mapped to a string(TRAINER/SLOT)]
fellow chooses a slot and sends to calli
calli uses the slot to create a calendar event for that fellow with that trainer
calli sends reminders to the fellows when the day is coming. 
  :--(abtract this method out so that is the same as the one that reminds the birthday,  leave and the rest )
*/

//
var _ = require("lodash");



function addFellowToInterviewTeam() {}

function updateAddedFellow() {}

function getTrainerSchedule() {}

//abstract this method
function createCalendarEvent() {}

function addMemberInterviewerToCalendarEvent() {}

function sendAvailableTrainerSchedulesToFellows() {}

function getFellowChoiceOfSchedule() {}

//abstract this mmethod
function remindInterviewersAboutMeeting() {}


//Export all functions
module.exports = {
    addFellowToInterviewTeam: addFellowToInterviewTeam,
    updateAddedFellow: updateAddedFellow,
    getTrainerSchedule: getTrainerSchedule,
    createCalendarEvent: createCalendarEvent,
    addMemberInterviewerToCalendarEvent: addMemberInterviewerToCalendarEvent,
    sendAvailableTrainerSchedulesToFellows: sendAvailableTrainerSchedulesToFellows,
    getFellowChoiceOfSchedule: getFellowChoiceOfSchedule,
    remindInterviewersAboutMeeting: remindInterviewersAboutMeeting
};
