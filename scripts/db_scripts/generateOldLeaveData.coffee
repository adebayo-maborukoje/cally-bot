async = require 'async'
LeaveEvent = require('../userdb').LeaveEvent
authorizeApp = require('../googleApi').authorizeApp
calendar = require('googleapis').calendar('v3')
fellowsLeaveCalendarId = 'andela.co_8q5ndpq7vfikvmrinv0oladgd8@group.calendar.google.com'

async.waterfall [
  (callback) ->
    authorizeApp (authClient) -> 
      callback null, authClient
    return
  (auth, callback) ->
    calendar.events.list (
      auth: auth
      calendarId: fellowsLeaveCalendarId
      timeMin: '2015-11-01T11:06:33+00:00'
      timeMax: '2015-12-30T11:06:33+00:00'
    ), (err, all)-> 
      if err
        console.log "There was an error contacting the Calendar service: #{err}"
      if all
        callback null, all.items
    return
  (events, callback) ->
    # arg1 now equals 'three'
    # _function(events)
    console.log events[0]
    callback null, 'done'
    return
], (err, result) ->
  # result now equals 'done'
  console.log result
  process.exit(1);
  return

_function = (leaveEvents) -> 
  async.each leaveEvents, ((event, callback) ->
    # Perform operation on file here.
    console.log 'Processing file '
    if event
      console.log 'This file name is too long'
      callback()
    return
  )
