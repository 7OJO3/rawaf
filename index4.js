const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ActivityType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    color: 0x4B0082,
    images: { thumbnail: "https://i.imgur.com/your_thumb.jpg", image: "https://i.imgur.com/your_image.jpg" }
};

let db = { staffPoints: {} };
if (fs.existsSync('./tickets_data.json')) db = JSON.parse(fs.readFileSync('./tickets_data.json'));
function saveDb() { fs.writeFileSync('./tickets_data.json', JSON.stringify(db, null, 2)); }

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('RAWAF SA BOT', { type: ActivityType.Streaming, url: 'https://www.twitch.tv/rawaf' });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'map_roles') {
            await interaction.reply({ content: `**السلام عليكم؛**\nشرح بسيط للرتب، لللإستفسار تواصل مع الاداره\n\n> رتب التفاعل\n<@&1519046388430803065> **اللفل المطلوب : 5**\n<@&1519046968469491752> **اللفل المطلوب : 10**\n<@&1519047263626727647> **اللفل المطلوب : 15**\n<@&1519047654116425758> **اللفل المطلوب : 25**\n<@&1519047973965795540> **اللفل المطلوب : 35**\n<@&1519048167188861018> **اللفل المطلوب : 60**\n<@&1519048390187548722> **اللفل المطلوب : 80**`, ephemeral: true });
        }
        if (interaction.customId === 'map_premium') {
            await interaction.reply({ content: `الرتب المميزه\n<@&1519048728755830785> يوتيوبر\n<@&1519048847559622769> تيكتوكر\n<@&1519049800287518780> فانز 1k+\n<@&1519049858047152279> فانز 10k+\n<@&1519049752157749418> كخاوي\n<@&1519049595244515418> رسام`, ephemeral: true });
        }
        if (interaction.customId === 'map_rooms') {
            await interaction.reply({ content: `**دليل السيرفر...**`, ephemeral: true });
        }
       const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ActivityType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    color: 0x4B0082,
    thumb: './IMG_7025.jpeg', // تأكدي من اسم الملف
    mainImg: './IMG_5240.jpeg' // تأكدي من اسم الملف
};

let db = { staffPoints: {} };
if (fs.existsSync('./tickets_data.json')) db = JSON.parse(fs.readFileSync('./tickets_data.json'));
function saveDb() { fs.writeFileSync('./tickets_data.json', JSON.stringify(db, null, 2)); }

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'btn_claim') {
            db.staffPoints[interaction.user.id] = (db.staffPoints[interaction.user.id] || 0) + 1;
            saveDb();
            await interaction.reply(`✅ **تم استلام التكت بواسطة: ${interaction.user}**`);
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_close').setLabel('غلق التكت').setStyle(ButtonStyle.Danger));
            await interaction.message.edit({ components: [row] });
        }
        if (interaction.customId === 'btn_close') {
            const modal = new ModalBuilder().setCustomId('modal_close').setTitle('سبب الغلق');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('c_reason').setLabel('اكتب سبب الغلق').setStyle(TextInputStyle.Paragraph).setRequired(true)));
            return await interaction.showModal(modal);
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_close') {
        const reason = interaction.fields.getTextInputValue('c_reason');
        const logChannel = interaction.guild.channels.cache.get(CONFIG.logChannel);
        
        // رسالة للأرشيف
        if (logChannel) {
            logChannel.send({
                content: `**أرشفة تذكرة:**\n**بواسطة الإداري:** ${interaction.user}\n**السبب:** ${reason}`,
                files: [CONFIG.thumb]
            });
        }
        
        // رسالة للخاص للعضو
        const member = interaction.channel.members.find(m => !m.user.bot && m.id !== interaction.user.id);
        if (member) {
            member.send({
                content: `تم غلق تذكرتك في سيرفر رواف. السبب: ${reason}`,
                files: [CONFIG.thumb, CONFIG.mainImg]
            }).catch(() => {});
        }
        
        await interaction.reply('جاري غلق التكت...');
        await interaction.channel.delete();
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'تكت') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('t_support').setLabel('تواصل مع الإدارة').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('t_complaint').setLabel('شكوى').setStyle(ButtonStyle.Primary)
        );
        await message.channel.send({ 
            embeds: [new EmbedBuilder().setTitle("نظام تذاكر").setImage("attachment://IMG_5240.jpeg")], 
            files: [CONFIG.mainImg], components: [row] 
        });
    }

    if (cmd === 'تكتات') {
        const member = message.mentions.members.first();
        if (member) message.reply(`الإداري ${member.displayName} استلم **${db.staffPoints[member.id] || 0}** تكت.`);
    }
});
    
    }
    if (cmd === 'خريطة') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('map_roles').setLabel('شرح رتب').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_premium').setLabel('رتب مميزة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_rooms').setLabel('شرح رومات').setStyle(ButtonStyle.Secondary),
            thumb: './IMG_7025.jpeg', // تأكدي من اسم الملف
            mainImg: './IMG_5240.jpeg' // تأكدي من اسم الملف
        );
        await message.channel.send({ embeds: [new EmbedBuilder().setTitle("دليل سيرفر رواف").setColor(CONFIG.color)], components: [row] });
    }
    if (!message.member.roles.cache.has(CONFIG.adminRole)) return;
    if (cmd === 'طرد') { const m = message.mentions.members.first(); if (m) m.kick(); }
    if (cmd === 'بان') { const m = message.mentions.members.first(); if (m) m.ban(); }
    if (cmd === 'قفل') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false }); }
    if (cmd === 'فتح') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true }); }
});

client.login(process.env.TOKEN);
