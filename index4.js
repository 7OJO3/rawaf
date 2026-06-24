const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ActivityType, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    categoryID: "1518850112078483577", 
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
    // 1. عند الضغط على أزرار التكت: نفتح النموذج
    if (interaction.isButton() && ['t_support', 't_complaint', 't_role', 't_creator'].includes(interaction.customId)) {
        const modal = new ModalBuilder().setCustomId('modal_ticket_data').setTitle('بيانات التذكرة');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('t_reason').setLabel('سبب فتح التذكرة').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('t_desc').setLabel('شرح التفاصيل').setStyle(TextInputStyle.Paragraph).setRequired(true))
        );
        return await interaction.showModal(modal);
    }

    // 2. معالجة بيانات النموذج وإنشاء التكت
    if (interaction.isModalSubmit() && interaction.customId === 'modal_ticket_data') {
        await interaction.deferReply({ ephemeral: true });
        const reason = interaction.fields.getTextInputValue('t_reason');
        const desc = interaction.fields.getTextInputValue('t_desc');

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: CONFIG.categoryID,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles] },
                { id: CONFIG.adminRole, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        const embed = new EmbedBuilder()
            .setTitle("تذكرة جديدة")
            .setDescription(`**صاحب التذكرة:** ${interaction.user}\n**السبب:** ${reason}\n**الشرح:** ${desc}`)
            .setColor(4915330);

        await channel.send({ content: `${interaction.user}، تم فتح التذكرة. بانتظار الإدارة.`, embeds: [embed] });
        await channel.send({ components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_claim').setLabel('استلام التكت').setStyle(ButtonStyle.Success))] });
        await interaction.editReply({ content: `✅ تم إنشاء تذكرتك في: ${channel}` });
    }

    // 3. باقي المعالجات (استلام، غلق، خريطة)
    if (interaction.isButton()) {
        const id = interaction.customId;
        if (id === 'btn_claim') {
            db.staffPoints[interaction.user.id] = (db.staffPoints[interaction.user.id] || 0) + 1;
            saveDb();
            await interaction.reply({ content: `✅ **تم استلام التكت بواسطة: ${interaction.user}**` });
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_close').setLabel('غلق التكت').setStyle(ButtonStyle.Danger));
            await interaction.message.edit({ components: [row] });
        }
        if (id === 'btn_close') {
            const modal = new ModalBuilder().setCustomId('modal_close').setTitle('سبب الغلق');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('c_reason').setLabel('اكتب سبب الغلق').setStyle(TextInputStyle.Paragraph).setRequired(true)));
            return await interaction.showModal(modal);
        }
        if (id === 'map_roles') await interaction.reply({ content: `**شرح الرتب...**`, ephemeral: true });
        if (id === 'map_premium') await interaction.reply({ content: `**الرتب المميزة...**`, ephemeral: true });
        if (id === 'map_rooms') await interaction.reply({ content: `**دليل الرومات...**`, ephemeral: true });
    }

    // 4. أرشفة التكت في الروم (Embed فقط)
    if (interaction.isModalSubmit() && interaction.customId === 'modal_close') {
        const reason = interaction.fields.getTextInputValue('c_reason');
        const logChannel = interaction.guild.channels.cache.get(CONFIG.logChannel);
        
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle("أرشفة تذكرة")
                .setColor(4915330)
                .addFields(
                    { name: "رقم التذكرة", value: interaction.channel.id, inline: true },
                    { name: "صاحب التذكرة", value: interaction.channel.name.replace('ticket-', ''), inline: true },
                    { name: "سبب الغلق", value: reason, inline: false }
                )
                .setTimestamp();
            logChannel.send({ embeds: [logEmbed] });
        }
        
        await interaction.reply('جاري غلق التكت...');
        setTimeout(() => interaction.channel.delete(), 2000);
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'تكت') {
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('t_support').setLabel('تواصل مع الإدارة').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('t_complaint').setLabel('شكوى').setStyle(ButtonStyle.Primary)
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('t_role').setLabel('طلب رتبة').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('t_creator').setLabel('صناع المحتوى').setStyle(ButtonStyle.Secondary)
        );
        await message.channel.send({ 
            embeds: [new EmbedBuilder().setTitle("نظام تذاكر سيرفر رواف").setDescription("الرجاء اختيار القسم المناسب.").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], 
            files: [CONFIG.thumb, CONFIG.mainImg], 
            components: [row1, row2] 
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
