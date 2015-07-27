var url = 'https://slack.com/api/';
var token = 'xoxb-6098518390-PMvTDFpU7DcunPMV3YIWyYS0';
var axios = require('axios');

function getUserFromSlack(userid) {
    return axios.get(url + 'users.info?token=' + token + '&user=' + userid)
        .then(function(response) {
            var andela = response.data;
            return andela.user.is_admin;
        });
}

function getGroup(channel, requester) {
    return axios.get(url + 'groups.info?token=' + token + '&channel=' + channel).then(function(response) {
        var slackGroupMembers = response.data.group.members;
        var isMember = slackGroupMembers.indexOf(requester);
        return isMember;
    });
}


module.exports = {
    getUserFromSlack: getUserFromSlack,
    getGroup: getGroup
};
