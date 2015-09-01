var url = 'https://slack.com/api/';
var token = 'xoxb-6098518390-PMvTDFpU7DcunPMV3YIWyYS0';
var axios = require('axios');

var exports = module.exports = {};

exports.getUserFromSlack = function(userid) {
    return axios.get(url + 'users.info?token=' + token + '&user=' + userid)
        .then(function(response) {
            var andela = response.data;
            return andela.user.is_admin;
        });
};

exports.getGroup = function(channel, requester) {
    return axios.get(url + 'groups.info?token=' + token + '&channel=' + channel)
        .then(function(response) {
            var slackGroupMembers = response.data.group.members;
            var isMember = slackGroupMembers.indexOf(requester);
            return isMember;
        });
};

var getAllSlackMembers = function() {
    return axios.get(url + 'users.list?token=' + token)
        .then(function(response) {
            var allMembers = response.data.members;
            return allMembers.filter(function(x) {
                return !(x.is_bot || x.deleted);
            }).map(function(activeMembers) {
                var b = {
                    id: activeMembers.id,
                    name: activeMembers.name,
                    real_name: activeMembers.profile.real_name,
                    real_name_normalised: activeMembers.profile.real_name_normalized,
                    email: activeMembers.profile.email
                };

                return b;
            });
        })
        .then(function(result) {
            return result;
        });
};

getAllSlackMembers();
