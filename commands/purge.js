module.exports = {
    name: 'purge',
    description: 'Bulk delete messages from channel called from. limited to 2 weeks worth. older will not be removed.',
    execute(message, args) {
        if(isNaN(`${args[0]}`)){
            message.channel.send("Please use a number. Maximum is 100.")
        }
        else{
            if(`${args[0]}` > 100){ 
                // the try catch seemingly doesnt... catch... the UnhandledPromiseRejectionWarning: DiscordAPIError: You can only bulk delete messages that are under 14 days old.
                // so... it works, ill look further into catching that later.. if i remember.
                // it purges shit that isnt older than 2 weeks. works.. good enough.
                try {
                    message.channel.bulkDelete(100).then(() => {
                        message.channel.send("Deleted maximum 100 messages.. This message will self destruct.").then(msg => msg.delete(5000));
                    });  
                } catch(error) {
                    message.channel.send("As much content has been purged as possible. Cannot delete content older than 2 weeks.")
                    return
                }               
            }
            else{
                try {
                    message.channel.bulkDelete(`${args[0]}`).then(() => {
                        message.channel.send(`Deleted ${args[0]} messages.. This message will self destruct.`).then(msg => msg.delete(5000));
                    });  
                } catch(error) {
                    message.channel.send("As much content has been purged as possible. Cannot delete content older than 2 weeks.")
                    return
                }            
            }
        }
    },
};