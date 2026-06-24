const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ActivityType } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    color: 0x4B0082
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('RAWAF SA BOT', { type: ActivityType.Streaming, url: 'https://www.twitch.tv/rawaf' });
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();

    // 1. أوامر الخريطة
    if (cmd === 'خريطة') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('map_roles').setLabel('شرح رتب التفاعل').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_premium').setLabel('الرتب المميزه').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_rooms').setLabel('شرح الرومات').setStyle(ButtonStyle.Secondary)
        );
        const embed = new EmbedBuilder().setTitle("مرحباً بك في سيرفر رواف").setDescription("هنا تجد دليلك لكل شيء").setColor(CONFIG.color);
        await message.channel.send({ embeds: [embed], components: [row] });
    }

    // 2. أمر التكت
    if (cmd === 'تكت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('t_support').setLabel('تواصل مع الإدارة').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('t_complaint').setLabel('شكوى').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('t_rank').setLabel('طلب رتبة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('t_creator').setLabel('صناع المحتوى').setStyle(ButtonStyle.Secondary)
        );
        const embed = new EmbedBuilder().setTitle("نظام تذاكر سيرفر رواف").setDescription("اختر القسم المناسب لفتح تذكرة.").setColor(CONFIG.color);
        await message.channel.send({ embeds: [embed], components: [row] });
    }

    // 3. أوامر الإدارة (محمية برتبة الإدارة)
    if (message.member.roles.cache.has(CONFIG.adminRole)) {
        if (cmd === 'طرد') { const m = message.mentions.members.first(); if (m) { m.kick(); message.reply('تم طرد العضو.'); } }
        if (cmd === 'بان') { const m = message.mentions.members.first(); if (m) { m.ban(); message.reply('تم حظر العضو.'); } }
        if (cmd === 'فك-بان') { const id = args[0]; if (id) { message.guild.members.unban(id); message.reply('تم فك الحظر.'); } }
        if (cmd === 'تغيير-اسم') { const m = message.mentions.members.first(); const nick = args.slice(1).join(' '); if (m) { m.setNickname(nick); message.reply('تم تغيير الاسم.'); } }
        if (cmd === 'تايم-اوت') { const m = message.mentions.members.first(); if (m) { m.timeout(300000, 'مخالفة'); message.reply('تم إعطاء تايم اوت.'); } }
        if (cmd === 'قفل') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false }); message.reply('تم قفل الشات.'); }
        if (cmd === 'فتح') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true }); message.reply('تم فتح الشات.'); }
        if (cmd === 'مسح') { const n = parseInt(args[0]); if (n) { message.channel.bulkDelete(n, true); message.reply(`تم مسح ${n} رسالة.`); } }
        if (cmd === 'اعط-رول') { const m = message.mentions.members.first(); const r = message.mentions.roles.first(); if (m && r) { m.roles.add(r); message.reply('تم إضافة الرتبة.'); } }
        if (cmd === 'شيل-رول') { const m = message.mentions.members.first(); const r = message.mentions.roles.first(); if (m && r) { m.roles.remove(r); message.reply('تم إزالة الرتبة.'); } }
    }
});

client.on('interactionCreate', async interaction => {
    // معالجة الأزرار (الخريطة والتكت)
    if (interaction.isButton()) {
        if (interaction.customId === 'map_roles') await interaction.reply({ content: 'شرح الرتب هنا...', ephemeral: true });
        if (interaction.customId === 'map_premium') await interaction.reply({ content: 'الرتب المميزة...', ephemeral: true });
        if (interaction.customId === 'map_rooms') await interaction.reply({ content: 'شرح الرومات...', ephemeral: true });
        
        if (['t_support', 't_complaint'].includes(interaction.customId)) {
            const modal = new ModalBuilder().setCustomId('modal_data').setTitle('تفاصيل التذكرة');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('السبب').setStyle(TextInputStyle.Paragraph).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('desc').setLabel('الوصف').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            await interaction.showModal(modal);
        }
        if (interaction.customId === 'btn_close') { /* منطق الغلق */ await interaction.reply('تم الغلق'); }
        if (interaction.customId === 'btn_delete') { await interaction.channel.delete(); }
    }
});

client.login(process.env.TOKEN);
