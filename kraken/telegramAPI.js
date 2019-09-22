const token = "928605672:AAE2s5XP6SZL-g7IkNNRmOVSm5FIaPuvbJ8";
const telegram = require('telegram-bot-api');

var api = new telegram({
    token: token,
    updates: {
        enabled: false
    }
});


exports.sendMessage = function(chatId, messageText) {
    api.sendMessage({
        chat_id: chatId,
        text: messageText
    })
};

exports.sendGIF = function(chatId, imageUrl) {
    api.sendVideo({
        chat_id: chatId,
        video: imageUrl
    })
};


