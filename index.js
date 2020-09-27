const Discord = require('discord.js');
const fs = require('fs');
const { CommandHandler } = require('djs-commands');
const config = JSON.parse(fs.readFileSync('./config.json','utf8'));
const CH = new CommandHandler({
    folder: __dirname + '/commands/',
    owners: config.owners,
    prefix: config.prefix
});

const bot = new Discord.Client();

bot.on("message", (message) => {
    if(message.author.type === 'bot') return;
    if(message.channel.type === 'dm') return;
    let args = message.content.split(" ");
    let command = args[0];
    let cmd = CH.getCommand(command);
    if(!cmd) return;

    try{
        cmd.run(bot,message,args)
    }catch(e){
        console.log(e)
    }

});

bot.login(config.token);
