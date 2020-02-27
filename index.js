// ----- Dependants Declare -----
const fs = require('fs'); // required for modular command integration
const config = require('./config/config.js');
const Discord = require('discord.js');
var mysql = require('mysql'); // required for dynamic command integration

const client = new Discord.Client();
client.commands = new Discord.Collection(); // creation of command content from imported files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // only select files ending in .js

// for each file discovered, register a command with the context declared.
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// ----- Initiation BEGIN -----

var connection = mysql.createConnection(config.databaseOptions);

// Server Log Message Declare
client.on('ready', () => {
	 // This event will run if the bot starts, and logs in, successfully.
    console.log(`${config.botSettings.displayName} has now started.`);
	console.log(`${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity(`${config.botSettings.displayName} - ${client.guilds.size} Servers`, { type: `${config.botSettings.discordStatus}` });
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`${config.botSettings.displayName} - ${client.guilds.size} Servers`, { type: `${config.botSettings.discordStatus}` });
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`${config.botSettings.displayName} - ${client.guilds.size} Servers`, { type: `${config.botSettings.discordStatus}` });
});

// ----- Initiation END -----

const prefixes = {}
// export this variable to allow it to be accessed accross the files.
module.exports = {
    prefixes
}

client.on("ready", function(){
    console.log("Initiating startup procedures.")
    
    //initialize all prefixes 
    client.guilds.tap(function(guild){
        function setValue (value) {
          result_arr = value;
        }
        function updateCommandPrefix() {
            // console.log(result_arr.length)
            if(result_arr.length === 0){
                console.log(`No Custom Prefix for Guild: ${guild.id} - Default Set: ${config.defaultPrefix.prefix}`)
                prefixes[guild.id] = {
                    prefixes: config.defaultPrefix.prefix
                };
            }
            else{
                var parseresults = JSON.parse(JSON.stringify(result_arr[0].Prefix))
                console.log(`Custom Prefix Confirmed - Guild: ${guild.id}, Prefix: ${parseresults}`)
                prefixes[guild.id] = {
                    prefixes: parseresults
                };
            }
        }

        var result_arr = [];

        console.log(`Setting config for Guild: ${guild.id}`)

        var sql_checkguildid = `
        SELECT * FROM ${config.databaseTableOptions.dbtable} WHERE ${config.databaseTableOptions.guildidcolumn} = '${guild.id}'
        `
        connection.connect();

        connection.query(sql_checkguildid, function (err, rows, fields) {
          if (err) throw err;
          else {
            setValue(rows);
            updateCommandPrefix();
          }
        });

        connection.end();
    });
});


// Client request responses
client.on('message', message => {

    // sets command prefix reference following startup checks for database entries
    // declared in the try catch statement as when using the message command, it has an issue referencing ID... 
    // so i decided to just stop it from complaining.
    let prefix;
    try {
        prefix = prefixes[message.guild.id] ? prefixes[message.guild.id].prefixes : config.defaultPrefix.prefix;
    } catch(error) {
        // console.log('prefix error - tried to re set it when messaging - this can be ignored now.')
        return
    }

    const args = message.content.slice(prefix).trim().split(/ +/g);
    const command = args.shift().toLowerCase().substring(prefix.length);

    // In the event the bot is tagged, respond accordingly.
    // commands can be handled with tagging, in this instance, i felt it best to focus towards seperating them for now.
    if (message.isMentioned(client.user)) {
        if (message.author.bot) return;
        else {
            if (`${args[0]}` === 'help' ){
                // ill be putting this in here in the event the prefix is forgotten, so you can confirm 
                message.channel.send(`... lets pretend i have a help command for a moment.. i'll get there eventually.`);
            }
            else{
                var tagResponses = [
                    'Fuck off cunt, dont @ me.',
                    'for fuck sake, what do you want?',
                    'NO! JUST STOP!',
                    '... Please dont do that again..',
                    'i swear, if you tag me again, i will shove my foot so far up your ass!',
                    ".. You're a disgrace, yeah they call me rabbit, this is a turtle race.",
                    'Ugh. Just dont.',
                    ''
                ];
                var randomResponse = tagResponses[Math.floor(Math.random() * tagResponses.length)];
                message.reply(`${randomResponse}`);
            }
        }
    }

    // ----- IGNORE THIS - PRETEND IT IS NOT HERE ----- //
    // This isnt really needed, i just wanted to let the bot react to cunt... and other things.
    const reactWords = [
        "word", 
        "fuck", 
        "chicken", 
        "geoff", 
        "cunt"
    ];
    const matchResults = reactWords.reduce((acc, val) => {
        if (message.content.includes(val)) acc.push(val);
        return acc
    }, [])
    if (matchResults.length > 0){
        const emojiArr = [
            '👌',
            '👍',
            '😄',
            '😂',
            '🖕'  
        ];
        const randomEmoji = emojiArr[Math.floor(Math.random()*emojiArr.length)];
        console.log(`Total Matches: ${matchResults.length} | ${matchResults.join(", ")} | ${message.content}`);
        message.react(randomEmoji)
    }
    // ----- IGNORE THIS - PRETEND IT IS NOT HERE ----- //

    // Set Argument Decleration
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content.indexOf(prefix) !== 0) return;

    // From imported command files, this is where commands are handled.
    if (!client.commands.has(command)){
        console.log('No commands registered')
        console.log(client.commands.keys())
        return
    }; 
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }

});

//BOT_TOKEN is the Client Secret integrated with Heroku
client.login(process.env.BOT_TOKEN); 



