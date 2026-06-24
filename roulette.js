const { client, db } = require('./index4.js'); 
const cron = require('node-cron');

// 1. التحديث التلقائي كل يوم أحد (00:00)
cron.schedule('0 0 * * 0', async () => {
    const guild = client.guilds.cache.get('1518844888245141525'); // ID السيرفر
    if (!guild) return;

    const logChannel = guild.channels.cache.get('1519276872150679602'); // رتبة الإعلان
    const roleID = '1519277727096639609'; // الرتبة التي سيتم إعطاؤها

    if (!logChannel) return;

    // ترتيب الأعضاء حسب النقاط
    const sorted = Object.entries(db.points || {}).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);
    
    // إزالة الرتبة من الكل أولاً
    const role = guild.roles.cache.get(roleID);
    if (role) {
        role.members.forEach(member => member.roles.remove(role).catch(() => {}));
    }

    // إرسال النتيجة وإعطاء الرتب
    let msg = "🏆 **قائمة أبطال الأسبوع:**\n\n";
    const emojis = ["<a:9_:1347369538244841594>", "<a:9_:1347369525674508318>", "<a:9_:1347369514584637460>"];
    
    for (let i = 0; i < top3.length; i++) {
        const item = top3[i];
        const user = await guild.members.fetch(item[0]).catch(() => null);
        
        if (user) {
            await user.roles.add(roleID).catch(() => {});
            msg += `${emojis[i]} | <@${user.id}> - **${item[1]}** نقطة\n`;
        }
    }
    logChannel.send(msg);
});

// 2. أمر عرض التوب يدوياً (يكتبه العضو في الشات)
client.on('messageCreate', async message => {
    if (message.content === '!توب') {
        const sorted = Object.entries(db.points || {}).sort((a, b) => b[1] - a[1]).slice(0, 3);
        
        if (sorted.length === 0) return message.reply("⚠️ لا توجد نقاط مسجلة حالياً.");

        let msg = "🏆 **قائمة المتصدرين (التوب 3):**\n\n";
        const emojis = ["<a:9_:1347369538244841594>", "<a:9_:1347369525674508318>", "<a:9_:1347369514584637460>"];
        
        sorted.forEach((item, index) => {
            msg += `${emojis[index]} | <@${item[0]}> - **${item[1]}** نقطة\n`;
        });

        message.channel.send(msg);
    }
});
