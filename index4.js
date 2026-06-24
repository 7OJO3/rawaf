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
    thumb: './IMG_7025.jpeg',
    mainImg: './IMG_5240.jpeg'
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
        const id = interaction.customId;

        // معالجة أزرار التكت
        if (id === 't_support' || id === 't_complaint') {
            await interaction.reply({ content: `✅ جاري فتح تذكرتك (${id === 't_support' ? 'دعم فني' : 'شكوى'})...`, ephemeral: true });
        }
        
        // معالجة زر الاستلام
        if (id === 'btn_claim') {
            db.staffPoints[interaction.user.id] = (db.staffPoints[interaction.user.id] || 0) + 1;
            saveDb();
            await interaction.reply({ content: `✅ **تم استلام التكت بواسطة: ${interaction.user}**` });
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_close').setLabel('غلق التكت').setStyle(ButtonStyle.Danger));
            await interaction.message.edit({ components: [row] });
        }
        
        // معالجة زر الغلق
        if (id === 'btn_close') {
            const modal = new ModalBuilder().setCustomId('modal_close').setTitle('سبب الغلق');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('c_reason').setLabel('اكتب سبب الغلق').setStyle(TextInputStyle.Paragraph).setRequired(true)));
            return await interaction.showModal(modal);
        }

        // أزرار الخريطة
        if (id === 'map_roles') await interaction.reply({ content: `**شرح الرتب...**`, ephemeral: true });
        if (id === 'map_premium') await interaction.reply({ content: `**الرتب المميزة...**`, ephemeral: true });
        if (id === 'map_rooms') await interaction.reply({ content: `**دليل الرومات...**`, ephemeral: true });
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_close') {
        const reason = interaction.fields.getTextInputValue('c_reason');
        const logChannel = interaction.guild.channels.cache.get(CONFIG.logChannel);
        if (logChannel) logChannel.send({ content: `**أرشفة تذكرة:**\n**بواسطة الإداري:** ${interaction.user}\n**السبب:** ${reason}`, files: [CONFIG.thumb] });
        
        const member = interaction.channel.members.find(m => !m.user.bot && m.id !== interaction.user.id);
        if (member) member.send({ content: `تم غلق تذكرتك في سيرفر رواف. السبب: ${reason}`, files: [CONFIG.thumb, CONFIG.mainImg] }).catch(() => {});
        
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
            embeds: [new EmbedBuilder().setTitle("نظام تذاكر").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], 
            files: [CONFIG.thumb, CONFIG.mainImg], 
            components: [row] 
        });
    }

    if (cmd === 'خريطة') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('map_roles').setLabel('شرح رتب').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_premium').setLabel('رتب مميزة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('map_rooms').setLabel('شرح رومات').setStyle(ButtonStyle.Secondary)
        );
        await message.channel.send({ 
            embeds: [new EmbedBuilder().setTitle("دليل سيرفر رواف").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], 
            files: [CONFIG.thumb, CONFIG.mainImg], 
            components: [row] 
        });
    }

    if (cmd === 'تكتات') {
        const member = message.mentions.members.first();
        if (member) message.reply(`الإداري ${member.displayName} استلم **${db.staffPoints[member.id] || 0}** تكت.`);
    }

    if (!message.member.roles.cache.has(CONFIG.adminRole)) return;
    if (cmd === 'طرد') { const m = message.mentions.members.first(); if (m) m.kick(); }
    if (cmd === 'قفل') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false }); }
    if (cmd === 'فتح') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true }); }
});

client.login(process.env.TOKEN);
