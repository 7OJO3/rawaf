const { client, db } = require('./index4.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

client.on('messageCreate', async message => {
    // 1. أمر الروليت
    if (message.content === '!روليت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_roulette').setLabel('انضمام').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('shop_roulette').setLabel('متجر الخصائص').setStyle(ButtonStyle.Primary)
        );
        message.channel.send({ content: "🎮 **لعبة الروليت!**\nشاركونا في الجولة القادمة:", components: [row] });
    }

    // 2. أمر نقاطي (يقرأ من قاعدة بيانات index4)
    if (message.content.startsWith('!نقاطي')) {
        let pts = db.points[message.author.id] || 0;
        message.reply(`💰 نقاطك الحالية هي: **${pts}**`);
    }

    // 3. أمر عط (الإداري)
    if (message.content.startsWith('!عط')) {
        // تأكدي من صلاحية الإدارة
        if (!message.member.permissions.has('Administrator')) return;
        
        const args = message.content.split(' ');
        const target = message.mentions.members.first();
        const amount = parseInt(args[2]);
        
        if (target && amount) {
            db.points[target.id] = (db.points[target.id] || 0) + amount;
            message.reply(`✅ تم إعطاء **${target.displayName}** عدد **${amount}** نقطة.`);
        } else {
            message.reply("⚠️ الاستخدام: `!عط @العضو 100`");
        }
    }
});
