const { client } = require('./index4.js'); // ربط البوت
const cron = require('node-cron');

// كود التحديث الأسبوعي
cron.schedule('0 0 * * 0', async () => {
    const guild = client.guilds.cache.get('1518844888245141525'); // تأكدي من ID السيرفر
    const logChannel = guild.channels.cache.get('1519276872150679602');
    const roleID = '1519277727096639609';

    if (!logChannel) return;

    // الرسالة الأولية (قبل التحديث)
    await logChannel.send("⏳ **جاري تحديث قائمة أبطال الأسبوع، انتظروا النتائج...**");

    // منطق التحديث
    const sorted = Object.entries(db.points || {}).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);
    
    // إزالة الرتبة القديمة (اختياري)
    const role = guild.roles.cache.get(roleID);
    if (role) {
        role.members.forEach(member => member.roles.remove(role));
    }

    // بناء الرسالة النهائية
    let msg = "🏆 **قائمة أبطال الأسبوع (التوب 3):**\n\n";
    top3.forEach((item, index) => {
        const user = guild.members.cache.get(item[0]);
        if (user) {
            user.roles.add(roleID);
            const emojis = ["<a:9_:1347369538244841594>", "<a:9_:1347369525674508318>", "<a:9_:1347369514584637460>"];
            msg += `${emojis[index]} | <@${user.id}>\n`;
        }
    });

    logChannel.send(msg);
});