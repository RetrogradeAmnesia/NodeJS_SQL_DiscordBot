const Discord       = require('discord.js');
const config        = require('../config/config.js');
const mysql         = require('mysql');

module.exports = {
  name: 'prefix',
  description: 'Change Command Prefix!',
  execute(message, args) {

    var connection  = mysql.createConnection(config.databaseOptions);

    var prefixsource  = require('../index.js');
    var prefixes    = prefixsource.prefixes

    let prefix = prefixes[message.guild.id] ? prefixes[message.guild.id].prefixes : config.defaultPrefix.prefix;

    // SQL Commands to add/update/remove settings
    var sql_updateprefix = `
    UPDATE ${config.databaseTableOptions.dbtable}
    SET ${config.databaseTableOptions.prefixcolumn}=${connection.escape(args[0])} 
    WHERE ${config.databaseTableOptions.guildidcolumn}=${message.guild.id};
    `

    var sql_removeprefix = `
    delete from ${config.databaseTableOptions.dbtable} 
    where ${config.databaseTableOptions.guildidcolumn} = "${message.guild.id}"
    `

    var sql_addprefix = `
    INSERT INTO ${config.databaseTableOptions.dbtable} (${config.databaseTableOptions.guildidcolumn}, ${config.databaseTableOptions.prefixcolumn}) 
    VALUES (${message.guild.id}, ${connection.escape(args[0])})
    `;

    var sql_checkguildid = `
    SELECT * FROM ${config.databaseTableOptions.dbtable} 
    WHERE ${config.databaseTableOptions.guildidcolumn} = '${message.guild.id}'
    `
    
    if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("No no no.");
    if(!args[0] || args[0 == "help"]) return message.reply(`Usage: ${prefix}prefix <desired prefix here>`);
  

    if (`${args[0]}`!== 'undefined' ){
      // Initiate Database Connection
      connection.connect(); 
      connection.query(sql_checkguildid, function (error, results, fields) {
        if (error){
          throw error
        };
        if (results.length >= 1){
          var parseresults = JSON.parse(JSON.stringify(results[0].Prefix))
          //console.log("Existing Prefix Confirmed: " + parseresults)
          console.log(`Initiate Prefix Update for GuildID: ${message.guild.id}`)
          //
            connection.query(sql_removeprefix, function (error, results, fields) {
              if (error) throw error;
              console.log('Records Removed: ', results.affectedRows);
      
                connection.query(sql_addprefix, function (error, results, fields) {
                  if (error) throw error;
                  console.log('Records Added: ', results.affectedRows);
                  connection.end();
                  console.log(`New Prefix for GuildID: ${message.guild.id} - ${args[0]}`)

                  prefixes[message.guild.id] = {
                    prefixes: args[0]
                  };
                  let prefix = prefixes[message.guild.id] ? prefixes[message.guild.id].prefixes : config.defaultPrefix.prefix;

                  let sEmbed = new Discord.RichEmbed()
                  .setColor("#FF9900")
                  .setTitle("Prefix Set!")
                  .setDescription(`Set to ${prefix}`);
                
                  message.channel.send(sEmbed);

                }); 
            });
          //
        }
        else{
          console.log(`Existing Prefix Not Available for GuildID ${message.guild.id} - Adding Record`)
          //
            connection.query(sql_addprefix, function (error, results, fields) {
              if (error) throw error;
              console.log('Records Added: ', results.affectedRows);
              connection.end();
              console.log(`New Prefix for GuildID: ${message.guild.id} - ${args[0]}`)

              prefixes[message.guild.id] = {
                prefixes: args[0]
              };
              let prefix = prefixes[message.guild.id] ? prefixes[message.guild.id].prefixes : config.defaultPrefix.prefix;
              
              let sEmbed = new Discord.RichEmbed()
              .setColor("#FF9900")
              .setTitle("Prefix Set!")
              .setDescription(`Set to ${prefix}`);
            
              message.channel.send(sEmbed);

            });   
          //
        }
      })
    }
    else{
      message.reply('You did not provide a new prefix.')
    }  
  },
};

