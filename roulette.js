const { client, db } = require('./index4.js'); // استيراد الـ db الموحدة
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

// دالة الحفظ (لضمان بقاء النقاط)
function saveDb() {
    fs.writeFileSync('./tickets_data.json', JSON.stringify(db, null, 2));
}

client.on('messageCreate', async message => {
    // 1. أمر الروليت
    if (message.content === '!روليت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_roulette').setLabel('انضمام').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('shop_roulette').setLabel('متجر الخصائص').setStyle(ButtonStyle.Primary)
        );
        message.channel.send({ content: "🎮 **لعبة الروليت!** شارك الآن:", components: [row] });
    }

    // 2. أمر نقاطي (يقرأ من قاعدة بياناتنا الموحدة db.points)
    if (message.content.startsWith('!نقاطي')) {
        // نستخدم db.points الموجودة في index4
        let pts = db.points[message.author.id] || 0;
        message.reply(`💰 نقاطك الحالية هي: **${pts}**`);
    }

    // 3. أمر عط (للإدارة فقط)
    if (message.content.startsWith('!عط')) {
        if (!message.member.permissions.has('Administrator')) return message.reply("❌ غير مسموح لك.");
        
        const args = message.content.split(' ');
        const target = message.mentions.members.first();
        const amount = parseInt(args[2]);
        
        if (target && amount) {
            // تحديث النقاط في قاعدة البيانات الموحدة
            db.points[target.id] = (db.points[target.id] || 0) + amount;
            saveDb(); // حفظ التغييرات فوراً
            message.reply(`✅ تم إعطاء ${target.displayName} ${amount} نقطة.`);
        } else {
            message.reply("⚠️ الاستخدام الصحيح: `!عط @العضو 100`");
        }
    }
});
