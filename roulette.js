const { client, db, saveDb } = require('./index4.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// 1. أمر إرسال رسالة الروليت
client.on('messageCreate', async message => {
    if (message.content === '!روليت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_roulette').setLabel('انضمام').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('shop_roulette').setLabel('متجر الخصائص').setStyle(ButtonStyle.Primary)
        );
        message.channel.send({ content: "🎮 **لعبة الروليت!**\nشاركونا في الجولة القادمة:", components: [row] });
    }

    // أمر النقاط
    if (message.content.startsWith('!نقاطي')) {
        let pts = db.points[message.author.id] || 0;
        message.reply(`💰 نقاطك الحالية هي: **${pts}**`);
    }

    // أمر الإعطاء الإداري
    if (message.content.startsWith('!عط')) {
        if (!message.member.permissions.has('Administrator')) return;
        const args = message.content.split(' ');
        const target = message.mentions.members.first();
        const amount = parseInt(args[2]);
        
        if (target && amount) {
            db.points[target.id] = (db.points[target.id] || 0) + amount;
            saveDb(); // حفظ البيانات فوراً
            message.reply(`✅ تم إعطاء **${target.displayName}** عدد **${amount}** نقطة.`);
        }
    }
});

// 2. معالجة الأزرار (تفاعلات الروليت)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'join_roulette') {
        interaction.reply({ content: "✅ تم تسجيل انضمامك للروليت!", ephemeral: true });
    }
    
    if (interaction.customId === 'shop_roulette') {
        interaction.reply({ content: "🛒 جاري فتح متجر الخصائص...", ephemeral: true });
    }
});
