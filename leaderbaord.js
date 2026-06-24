const { client, db } = require('./index4.js');
const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');

// 1. التحديث الأسبوعي التلقائي (كل أحد الساعة 00:00)
cron.schedule('0 0 * * 0', async () => {
    const guild = client.guilds.cache.get('1518844888245141525');
    const logChannel = guild?.channels.cache.get('1519276872150679602');
    const roleID = '1519277727096639609';

    if (!logChannel || !guild) return;

    await logChannel.send("⏳ **جاري تحديث قائمة أبطال الأسبوع، انتظروا النتائج...**");

    const sorted = Object.entries(db.points || {}).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);
    
    // إزالة الرتبة القديمة من الجميع
    const role = guild.roles.cache.get(roleID);
    if (role) {
        role.members.forEach(member => member.roles.remove(role).catch(() => {}));
    }

    // بناء الرسالة وإعطاء الرتب
    let msg = "🏆 **قائمة أبطال الأسبوع (التوب 3):**\n\n";
    const emojis = ["<a:9_:1347369538244841594>", "<a:9_:1347369525674508318>", "<a:9_:1347369514584637460>"];
    
    top3.forEach((item, index) => {
        const user = guild.members.cache.get(item[0]);
        if (user) {
            user.roles.add(roleID).catch(() => {});
            msg += `${emojis[index]} | <@${user.id}> - **${item[1]}** نقطة\n`;
        }
    });

    logChannel.send(msg);
});

// 2. أمر عرض التوب يدوياً (للمستخدمين)
client.on('messageCreate', async message => {
    if (message.content === '!توب') {
        const sorted = Object.entries(db.points || {}).sort((a, b) => b[1] - a[1]);
        const top3 = sorted.slice(0, 3);
        
        if (top3.length === 0) return message.reply("لا توجد نقاط مسجلة حالياً.");

        let embed = new EmbedBuilder()
            .setTitle("🏆 قائمة المتصدرين (التوب 3)")
            .setColor(0xF1C40F)
            .setDescription(top3.map((item, index) => 
                `${index + 1}- <@${item[0]}> : **${item[1]}** نقطة`
            ).join('\n'));

        message.channel.send({ embeds: [embed] });
    }
});
