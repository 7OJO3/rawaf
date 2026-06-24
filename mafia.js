const { client, db } = require('./index4.js');client.on('messageCreate', async message => {
    // أمر بدء لعبة المافيا
   client.on('messageCreate', async message => {
    if (message.content.startsWith('!مافيا')) {
        // هنا كود المافيا الخاص بكِ
        message.reply("بدأت لعبة المافيا! اضغطوا على الزر للانضمام...")
            .setTitle("🎮 لعبة المافيا - سيرفر رواف")
            .setDescription("اضغط على زر **انضمام** للمشاركة. \n\n⚠️ **تنبيه:** تأكد أن خاصك (DM) مفتوح، وإلا لن تستطيع استلام دورك!")
            .setColor(0x2f3136);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('join_mafia').setLabel('انضمام').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('leave_mafia').setLabel('خروج').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('start_mafia_btn').setLabel('بدء اللعبة (للإدارة)').setStyle(ButtonStyle.Primary)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});
module.exports = {};
