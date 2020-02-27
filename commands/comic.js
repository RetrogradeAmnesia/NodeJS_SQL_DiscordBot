module.exports = {
    name: 'comic',
    description: 'Get a random XKCD Comic!',
    execute(message, args) {

        var request = require('request');

        var min = 1
        var max = 2100
        var randomInt = Math.floor(min + Math.random() * (max + 1 - min))

        // HTTP Request
        request.get({
            url: `https://xkcd.com/${randomInt}/info.0.json`,
            json: true,
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // POST Image Start
                var ImageDataPost = {
                    "embed": {
                        "title": body.title,
                        "url": `https://xkcd.com/${randomInt}`,
                        "color": 9808072,
                        "footer": {
                            "text": "XKCD Random Comic"
                        },
                        "image": {
                            "url": body.img
                        }
                    }
                };
                message.channel.send(ImageDataPost);
                // POST Image End
            } else {
                console.log(error);
            }
        })
    },
};




