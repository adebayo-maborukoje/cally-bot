require('dotenv').load();
var shell = require('shelljs');
var token = process.env.SLACK_TOKEN

shell.exec('HUBOT_SLACK_TOKEN=' + token + ' ./bin/hubot -a slack');
