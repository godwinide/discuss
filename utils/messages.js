const moment = require('moment');

function formatMessage(username, text, type="general") {
  return {
    username,
    type,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
