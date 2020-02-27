module.exports = {
    name: 'message',
    description: 'Private Message A User!',
    execute(message, args) {
        message.author.send("I have been asked to send you a message. I do not know why.")
    },
};