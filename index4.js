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

let db = { staffPoints: {}, warnings: {} };
if (fs.existsSync('./tickets_data.json')) db = JSON.parse(fs.readFileSync('./tickets_data.json'));
function saveDb() { fs.writeFileSync('./tickets_data.json', JSON.stringify(db, null, 2)); }

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('RAWAF SA BOT', { type: ActivityType.Streaming, url: 'https://www.twitch.tv/rawaf' });
});

client.on('interactionCreate', async interaction => {
    // 1. فتح التكت
    if (interaction.isButton() && ['t_support', 't_complaint', 't_role', 't_creator'].includes(interaction.customId)) {
        const modal = new ModalBuilder().setCustomId('modal_ticket_data').setTitle('بيانات التذكرة');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('t_reason').setLabel('سبب فتح التذكرة').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('t_desc').setLabel('شرح التفاصيل').setStyle(TextInputStyle.Paragraph).setRequired(true))
        );
        return await interaction.showModal(modal);
    }

    // 2. معالجة فتح التكت + رسالة الخاص
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
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: CONFIG.adminRole, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        const embedInChannel = new EmbedBuilder()
            .setTitle("تذكرة جديدة")
            .setDescription(`**صاحب التذكرة:** ${interaction.user}\n**السبب:** ${reason}\n**الشرح:** ${desc}`)
            .setColor(4915330);

        await channel.send({ content: `<@&${CONFIG.adminRole}>، ${interaction.user} فتح تذكرة جديدة.`, embeds: [embedInChannel] });
        await channel.send({ components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_claim').setLabel('استلام التكت').setStyle(ButtonStyle.Success))] });

        const embedDM = new EmbedBuilder()
            .setTitle("تم فتح تذكرتك")
            .setDescription(`مرحباً ${interaction.user}، تم فتح تذكرتك بنجاح.\nيرجى التوجه إلى الروم: ${channel}`)
            .setThumbnail("attachment://IMG_7025.jpeg")
            .setImage("attachment://IMG_5240.jpeg")
            .setColor(4915330);
        
        interaction.user.send({ embeds: [embedDM], files: [CONFIG.thumb, CONFIG.mainImg] }).catch(() => {});
        await interaction.editReply({ content: `✅ تم إنشاء تذكرتك في: ${channel}` });
    }

    // 3. معالجة الأزرار (استلام، غلق، وأزرار الخريطة)
    if (interaction.isButton()) {
        const id = interaction.customId;

        // معالجة أزرار الخريطة
        if (id === 'map_roles') return await interaction.reply({ content: `**رتب التفاعل**\n\n<@&1519046388430803065> \n\n**اللفل المطلوب : 5**\n\n**استمتع بالسيرفر**\n\n<@&1519046968469491752> \n\n**اللفل المطلوب : 10**\n\n**الخواص: استخدام ايموجيز من خارج السيرفر واضافة رياكشنز**\n\n<@&1519047263626727647> \n\n**اللفل المطلوب : 15**\n\n**الخواص: تغيير اسمك بالسيرفر**\n\n<@&1519047654116425758> \n\n**اللفل المطلوب : 25**\n\n**الخواص: اختيار لونك الخاص <#1518870053192466503> **\n\n<@&1519047973965795540> \n\n**اللفل المطلوب :35**\n\n**الخواص : ارسال صور وفيديوهات بالشات العام**\n\n<@&1519048167188861018> \n\n**اللفل المطلوب :60**\n\n**الخواص : جميع ماسبق**\n\n<@&1519048390187548722> \n\n**اللفل المطلوب : 80**\n\n**الخواص : رتبه خاصه**`, ephemeral: true });
        if (id === 'map_premium') return await interaction.reply({ content: `// > **الرتب المميزه**\n\n<@&1519048728755830785>  يوتيوبر \n\n**قناتك لازم تكون فيها فوق الالف**\n\n<@&1519048847559622769> تيكتوكر \n\n**حسابك لازم يكون فيه 10k+**\n\n <@&1519049800287518780> \n\n**فانزات رواف الي عندهم 1k+ **\n\n <@&1519049858047152279> \n\n**فانزات رواف الي عندهم 10k+**\n\n<@&1519049752157749418> كخاوي\n\n**الي عنده لبس "كخه" **\n\n<@&1519049595244515418> رسام\n\n**الي عندهم حس فني**`, ephemeral: true });
        if (id === 'map_rooms') return await interaction.reply({ content: `**اهلاً وسهلا بك في دليل السيرفر ، هنا سيتم شرح أبزر الاشياء الموجوده داخل السيرفر:**\n\n// > **رومات السيرفر :**\n\n**الرومات العامه :**\n\n<#1518860063496867871>  \n\n### ترحيب لك عند دخولك\n\n-\n\n<#1518860483392704533> \n\n### هنا يظهر تقدمك بالسيرفر وكم اجتزت لفل\n\n-\n\n<#1518860676494397620> \n\n### بوستات السيرفر \n\n**شاتات السيرفر :**\n\n<#1518851646174662707> لمتابعة أحدث وأخر اخبار السيرفر\n\n-\n\n<#1518852029089579059> لإختيار الرتب واهتمامك بالسيرفر\n\n-\n\n<#1518850225991848016> لفتح تذكرة دعم للإدارة والأقسام \n\n-\n\n<#1518847251731185825> الشات العام للتحدث مع الأعضاء دون مخالفة القوانين\n\n-\n\n<#1518854040660869301> لمشاركة فنكم وابداعاتكم بالرسم\n\n-\n\n<#1518855027731599477> \n\nاقتراحاتكم لفيديوهات رواف الجايه\n\n-\n\n<#1518870053192466503> تغير لونك بالسيرفر\n\n **أقسام السيرفر :**\n\n**قسم الفعاليات :**\n\n<#1518853454443839619> شات الفعاليات عند اقامة فعاليه سيتم فتح الشات ويمكنك المشاركه \n\n<#1518853717825425579>  الفايزين مع رواف يقدرون يكتبون بالروم هذا\n\n**قسم الالعاب :**\n\n<#1518852185142591518> \n\n**قسم التصاميم :**\n\n<#1518859276683182142> تصاميمكم لرواف\n\n<#1518856037707546657> رسماتكم لرواف\n\n**قسم الفانزات :**\n\n<#1518871220706082867>  شات فانزات رواف الالماسيين\n\n-\n\n<#1518849706631893032> شات الكخاويين\n\n-\n\n<#1518849203722391754> يوزراتكم بروبلوكس\n\n**قسم التريدات :**\n\n<#1518857546822320131>  قوانين التريدات\n\n<#1518858420097126462> تريدات ام ام تو\n\n<#1518857897289842720> تريدات ادوبت مي\n\n<#1518858567896010913> بلوكس فروت \n\n<#1518858829759250433> بيت سلمنيتر`, ephemeral: true });

        // معالجة أزرار التكت
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
    }

    // 4. أرشفة التكت + رسالة الإغلاق بالخاص
    if (interaction.isModalSubmit() && interaction.customId === 'modal_close') {
        const reason = interaction.fields.getTextInputValue('c_reason');
        const logChannel = interaction.guild.channels.cache.get(CONFIG.logChannel);
        
        if (logChannel) {
            const logEmbed = new EmbedBuilder().setTitle("أرشفة تذكرة").setColor(4915330)
                .addFields({ name: "رقم التذكرة", value: interaction.channel.id, inline: true }, { name: "صاحب التذكرة", value: interaction.channel.name.replace('ticket-', ''), inline: true }, { name: "سبب الغلق", value: reason, inline: false });
            logChannel.send({ embeds: [logEmbed] });
        }
        
        const member = interaction.channel.members.find(m => !m.user.bot && m.id !== interaction.user.id);
        if (member) {
            const embed = new EmbedBuilder()
                .setTitle("تم إغلاق تذكرتك")
                .setDescription(`تم إغلاق التذكرة بواسطة الإداري: ${interaction.user}\n**السبب:** ${reason}`)
                .setThumbnail("attachment://IMG_7025.jpeg")
                .setImage("attachment://IMG_5240.jpeg")
                .setColor(0xFF0000);
            member.send({ embeds: [embed], files: [CONFIG.thumb, CONFIG.mainImg] }).catch(() => {});
        }
        await interaction.reply('جاري إغلاق التذكرة...');
        setTimeout(() => interaction.channel.delete(), 2000);
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();
    
    if (cmd === 'تكت') {
        const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('t_support').setLabel('تواصل مع الإدارة').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('t_complaint').setLabel('شكوى').setStyle(ButtonStyle.Primary));
        const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('t_role').setLabel('طلب رتبة').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('t_creator').setLabel('صناع المحتوى').setStyle(ButtonStyle.Secondary));
        await message.channel.send({ embeds: [new EmbedBuilder().setTitle("مرحبا بك في قسم الدعم الفني").setDescription("اذا كنت تواجه مشكلة,تحتاج الى مساعده,او ترغب بتقديم بلاغ, يمكنك فتح تذكره وسيتولى فريقنا مساعدتك.").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], files: [CONFIG.thumb, CONFIG.mainImg], components: [row1, row2] });
    }
    if (cmd === 'خريطة') {
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('map_roles').setLabel('شرح رتب').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('map_premium').setLabel('رتب مميزة').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('map_rooms').setLabel('شرح رومات').setStyle(ButtonStyle.Secondary));
        await message.channel.send({ embeds: [new EmbedBuilder().setTitle("مرحبا بك, هنا تجد دليلك لجميع رتب ورولات سيرفر رواف").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], files: [CONFIG.thumb, CONFIG.mainImg], components: [row] });
    }
    if (cmd === 'تكتات') { const member = message.mentions.members.first(); if (member) message.reply(`الإداري ${member.displayName} استلم **${db.staffPoints[member.id] || 0}** تكت.`); }
   // أوامر إدارية بالصلاحيات
    if (cmd === 'تكتات') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return message.reply("❌ لا تملك صلاحية إدارة السيرفر.");
        const member = message.mentions.members.first();
        if (member) message.reply(`الإداري ${member.displayName} استلم **${db.staffPoints[member.id] || 0}** تكت.`);
    }

    if (cmd === 'مسح') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("❌ لا تملك صلاحية حذف الرسائل.");
        const amount = parseInt(args[0]) || 10;
        message.channel.bulkDelete(amount).then(() => message.reply(`✅ تم مسح ${amount} رسالة`));
    }

    if (cmd === 'تايم_اوت') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.reply("❌ لا تملك صلاحية التايم أوت.");
        const member = message.mentions.members.first();
        const time = parseInt(args[0]) * 60 * 1000;
        if (member && time) { member.timeout(time); message.reply(`✅ تم إسكات ${member.user.tag}`); }
    }

    if (cmd === 'رتبة') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.reply("❌ لا تملك صلاحية إدارة الرتب.");
        const member = message.mentions.members.first();
        const role = message.mentions.roles.first();
        if (member && role) { member.roles.add(role); message.reply('✅ تمت إضافة الرتبة'); }
    }

    if (cmd === 'سحب_رتبة') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.reply("❌ لا تملك صلاحية إدارة الرتب.");
        const member = message.mentions.members.first();
        const role = message.mentions.roles.first();
        if (member && role) { member.roles.remove(role); message.reply('✅ تمت إزالة الرتبة'); }
    }

    if (cmd === 'تحذير') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply("❌ لا تملك صلاحية تحذير الأعضاء.");
        const member = message.mentions.members.first();
        if (!member) return;
        db.warnings[member.id] = (db.warnings[member.id] || 0) + 1;
        saveDb();
        message.reply(`⚠️ تم تحذير ${member.user.tag}. (عدد تحذيراته: ${db.warnings[member.id]})`);
    }

    if (cmd === 'تحذيرات') {
        const member = message.mentions.members.first() || message.member;
        message.reply(`العضو ${member.user.tag} لديه ${db.warnings[member.id] || 0} تحذير.`);
    }

    if (cmd === 'شيل_تحذير') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply("❌ لا تملك صلاحية تحذير الأعضاء.");
        const member = message.mentions.members.first();
        if (member) { db.warnings[member.id] = 0; saveDb(); message.reply('✅ تم تصفير تحذيرات العضو'); }
    }

    if (cmd === 'بند') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply("❌ لا تملك صلاحية الحظر.");
        const member = message.mentions.members.first();
        if (member) { member.ban(); message.reply('✅ تم حظر العضو'); }
    }

    if (cmd === 'فك_بند') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply("❌ لا تملك صلاحية الحظر.");
        const userId = args[0];
        message.guild.members.unban(userId).then(() => message.reply('✅ تم فك الحظر'));
    }
});

client.login(process.env.TOKEN);
