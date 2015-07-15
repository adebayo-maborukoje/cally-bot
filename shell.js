var shell = require('shelljs');
var token = 'xoxb-6098518390-PMvTDFpU7DcunPMV3YIWyYS0';

shell.exec('HUBOT_SLACK_TOKEN=' + token + ' ./bin/hubot -a slack');
