const { client } = require('./index.js');
let economy = {}; // { userID: points }

client.on('messageCreate', async message => {
    if (message.content === '!روليت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_roulette').setLabel('انضمام').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('shop_roulette').setLabel('متجر الخصائص').setStyle(ButtonStyle.Primary)
        );
        message.channel.send({ content: "لعبة الروليت! شارك الآن:", components: [row] });
    }

    if (message.content.startsWith('!نقاطي')) {
        let pts = economy[message.author.id] || 0;
        message.reply(`نقاطك الحالية هي: ${pts}`);
    }

    if (message.content.startsWith('!عط')) {
        if (!message.member.permissions.has('Administrator')) return;
        const target = message.mentions.members.first();
        const amount = parseInt(message.content.split(' ')[2]);
        if (target && amount) {
            economy[target.id] = (economy[target.id] || 0) + amount;
            message.reply(`تم إعطاء ${target.displayName} ${amount} نقطة.`);
        }
    }
});
module.exports = {};
