const request = require('request');

module.exports = {
    name: 'textme',
    description: 'Have the bot generate an image from text',
    execute(message, args) {

        var urlstr = args.join("+").toString()
        var url = `https://dummyimage.com/600x400/000000/fff.png&text=${urlstr}`
        
        var tinyurlgen = `https://tinyurl.com/api-create.php?url=${url}`

        request(`${tinyurlgen}`, { json: true }, (err, res, result) => {
          if (err) { return console.log(err); }
          message.channel.send(`${result}`);
        });        
    },
};