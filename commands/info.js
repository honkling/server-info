const unirest = require('unirest');
const Discord = require('discord.js');

function get(url) {
    unirest.get(url).then(e => {
        return e.body;
    });
};

module.exports = class Info {
    constructor(){
        this.name = 'info',
        this.alias = ['server'],
        this.usage = 'info';
    }
    run(bot, message, args) {
        unirest.get('https://api.minehut.com/server/' + args[1] + '?byName=true').then(e => {
            let cont = true;
            if(e.body.msg) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription("Couldn't fetch that server, did you misspell the name?")
                    .setColor("FF5555");
                message.channel.send(embed);
                let cont = 'no';
                return;
            }
            if(cont == 'no') return;
            const data = e.body.server;
            unirest.get('https://api.minehut.com/plugins_public').then(o => {
                const all = o.body.all;
                const list = data.active_plugins;
                const prop = data.server_properties;
                const plugins = [];
                all.filter(x => list.includes(x._id)).forEach(x => plugins.push(x.name));
                const embed = new Discord.MessageEmbed()
                    .setTitle(data.name)
                    .addFields(
                        {name: "Max Players", value: `${data.maxPlayers}`, inline: true},
                        {name: "Online Players", value: `${data.playerCount}`, inline: true},
                        {name: "Icon", value: data.icon ? data.icon.toLowerCase().replace(/\_/g, " ") : "No icon", inline: true},
                        {name: "Suspended?", value: `${data.suspended}`.replace("false", "No").replace("true", "Yes"), inline: true},
                        {name: "Credits/day", value: data.credits_per_day, inline: true},
                        {name: "Plugins", value: plugins.join('\n') !== '' ? plugins.join('\n') : 'No plugins installed'},
                        {name: "Server Properties", value: `**Spawn Protection** ${prop.spawn_protection}\n**View Distance** ${prop.view_distance}\n**Resource Pack SHA1** ${prop.resource_pack_sha1}\n**Resource Pack** ${prop.resource_pack}\n**Generator Settings** ${prop.generator_settings}\n**Level Name** ${prop.level_name}\n**Level Type** ${prop.level_type}\n**Announce Player Achievements** ${prop.announce_player_achievements}\n**Enable Command Blocks** ${prop.enable_command_block}\n**Generate Structures** ${prop.generate_structures}\n**Allow Nether** ${prop.allow_nether}\n**Level Seed** ${prop.level_seed}\n**Difficulty** ${prop.difficulty}\n**PVP** ${prop.pvp}\n**Hardcore** ${prop.hardcore}\n**Force Gamemode** ${prop.force_gamemode}\n**Spawn Mobs** ${prop.spawn_mobs}\n**Spawn Animals** ${prop.spawn_animals}\n**Allow Flight** ${prop.allow_flight}\n**Gamemode** ${prop.gamemode}`},
                    )
                    .setColor(data.online ? '55FF55' : 'FF5555');
                message.channel.send(embed);
            })
        });
    }
};
