var imageArray = [
    'https://www.testbytes.net/wp-content/uploads/2019/06/Untitled-63.png',
    'https://www.probytes.net/wp-content/uploads/2018/01/2-768x552.jpg',
    'https://www.probytes.net/wp-content/uploads/2018/01/3.jpg',
    'https://www.probytes.net/wp-content/uploads/2018/01/4-1.png'
]

module.exports = {
    name: 'picture',
    description: 'Have the bot post an image from a URL',
    execute(message, args) {

        var imageResponse = imageArray[Math.floor(Math.random() * imageArray.length)];
        let user = message.mentions.users.first();

        message.channel.send("Here is a random image", {
            file: `${imageResponse}` // Or replace with FileOptions object
        });
    },
};