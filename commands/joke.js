const request = require('request');

module.exports = {
    name: 'joke',
    description: 'Get a random joke!',
    execute(message, args) {

        request.get({
            url: `https://official-joke-api.appspot.com/random_joke`,
            json: true,
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                message.channel.send(body.setup + '\n' + body.punchline);
            }
            else {
                console.log(error);
            }
        })
    },
};
